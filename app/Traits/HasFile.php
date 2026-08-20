<?php

// namespace App\Traits;

// use Illuminate\Http\Request;

// use Illmuminate\Database\Eloquent\Model;

// use Illmuminate\Support\Facades\Storage;

// trait HasFile
// {
//     public function upload_file(Request $request, string $colomn, string $folder): ?string
//     {
//         return $request->hasFile($colomn) ? $request->file($colomn)->store($folder) : null;
//     }
//     public function update_file(Request $request, Model $model, string $colomn, string $folder): ?string
//     {
       
//         if($request->hasFile($colomn)){ 
//            $this->delete_file($model, $colomn);
//            # if($model->colomn){
//            #     Storage::delete($model->colomn);
//            # }

//             $thumbnail = $request->file($colomn)->store($folder);
            
//         }else {
//             $thumbnail = $model->colomn;
//             #$thumbnail = $user->avatar
//         }

//         return $thumbnail;
        
//     }

//     public function delete_file(Model $model, string $colomn): void
//     {
//         if($model->colomn){
//             Storage::delete($model->colomn);
//         }
//     }

// }

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

trait HasFile
{
    public function upload_file(Request $request, string $column, string $folder): ?string
    {
        if (! $request->hasFile($column)) {
            return null;
        }

        // simpan di disk 'public', folder misalnya 'faculties'
        return $request->file($column)->store($folder, 'public');
    }

    public function update_file(Request $request, Model $model, string $column, string $folder): ?string
    {
        if ($request->hasFile($column)) {
            // hapus file lama
            $this->delete_file($model, $column);

            // upload file baru
            return $request->file($column)->store($folder, 'public');
        }

        // kalau tidak ada file baru, pakai file lama
        return $model->{$column};
    }

    public function delete_file(Model $model, string $column): void
    {
        $path = $model->{$column};

        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
