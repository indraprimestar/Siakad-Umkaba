<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Fee;
use Midtrans\Config;
use Midtrans\Snap;
use Exception;
use Inertia\Response;
use App\Enums\FeeStatus;
class PaymentController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $params = [
            'transaction_details' => [
                'order_id' => $request->fee_code,
                'gross_amount' => $request->gross_amount,
            ],
            'customer_details' => [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
            ],
        ];

        $activeAcademicYear = activeAcademicYear();
        if (!$activeAcademicYear) {
            return response()->json([
                'error' => 'Tidak ada tahun ajaran yang aktif saat ini.',
            ], 400);
        }

        try {
            Fee::updateOrCreate(
                [
                    'student_id' => auth()->user()->student?->id,
                    'academic_year_id' => $activeAcademicYear->id,
                    'semester' => auth()->user()->student?->semester,
                ],
                [
                    'fee_code' => $request->fee_code,
                    'student_id' => auth()->user()->student?->id,
                    'fee_group_id' => auth()->user()->student?->fee_group_id,
                ]
            );

            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'snapToken' => $snapToken,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function callback(Request $request): JsonResponse
    {
        $serverKey = config('services.midtrans.server_key');
        $orderId = $request->order_id ?? $request->fee_code;
        
        $signatureKey = signatureMidtrans(
            order_id: $orderId,
            status_code: $request->status_code,
            gross_amount: $request->gross_amount,
            server_key: $serverKey,
        );
 
        if ($request->signature_key !== $signatureKey) {
            return response()->json([
                'error' => 'Unauthorized',
            ], 401);
        }
 
        $fee = Fee::query()
            ->where('fee_code', $orderId)
            ->first();
 
        if (!$fee) {
            return response()->json([
                'message' => 'Pembayaran tidak ditemukan',
            ], 404);
        }
 
        switch ($request->transaction_status) {
            case 'settlement':
                $fee->status = FeeStatus::SUCCESS->value;
                $fee->save();
                
                return response()->json([
                    'message' => 'Berhasil melakukan pembayaran',
                ], 200);
                break;
 
            case 'capture':
                $fee->status = FeeStatus::SUCCESS->value;
                $fee->save();
                
                return response()->json([
                    'message' => 'Berhasil melakukan pembayaran',
                ], 200);
                break;
 
            case 'pending':
                $fee->status = FeeStatus::PENDING->value;
                $fee->save();
                
                return response()->json([
                    'message' => 'Pembayaran Tertunda',
                ], 200);
                break;
 
            case 'expire':
                $fee->status = FeeStatus::EXPIRED->value;
                $fee->save();
                
                return response()->json([
                    'message' => 'Pembayaran Kedaluwarsa',
                ], 200);
                break;
 
            case 'cancel':
                $fee->status = FeeStatus::FAILED->value;
                $fee->save();
                return response()->json([
                    'message' => 'Pembayaran Dibatalkan',
                ], 200);
                break;
 
            default:
                return response()->json([
                    'message' => 'Status transaksi tidak diketahui',
                ], 400);
        }
    }

    public function success(): Response {
        $fee = Fee::query()
            ->where('student_id', auth()->user()->student?->id)
            ->where('academic_year_id', activeAcademicYear()?->id)
            ->where('semester', auth()->user()->student?->semester)
            ->first();

        if ($fee) {
            $fee->status = FeeStatus::SUCCESS->value;
            $fee->save();
        }

        return Inertia('Payments/Success');
    }
}