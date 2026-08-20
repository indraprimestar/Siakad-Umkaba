import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { Textarea } from '@/Components/ui/textarea';
import { flashMessage } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { IconChecklist } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Approve({ name, statuses, action }) {
    const { data, setData, put, errors, processing } = useForm({
        status: 'Pending',
        notes: '',
        _method: 'PUT',
    });

    const onHandleSubmit = (e) => {
        e.preventDefault();
        put(action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="green" size="icon">
                    <IconChecklist className="size-4" />
                </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Review & Approve</SheetTitle>
                    <SheetDescription>Update status for {name}</SheetDescription>
                </SheetHeader>

                <form onSubmit={onHandleSubmit} className="space-y-6 py-6">
                    {/* Status Select */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses && statuses.length > 0 ? (
                                    statuses.map((status, index) => (
                                        <SelectItem key={index} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                    </div>

                    {/* Notes Textarea */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Tambahkan catatan atau alasan approval"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <SheetTrigger asChild>
                            <Button variant="ghost" type="button">
                                Cancel
                            </Button>
                        </SheetTrigger>
                        <Button variant="blue" type="submit" disabled={processing} className="gap-2">
                            {processing ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <IconChecklist className="size-4" />
                                    Submit
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
