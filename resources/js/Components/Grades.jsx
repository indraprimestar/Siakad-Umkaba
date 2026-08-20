import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { IconEye } from '@tabler/icons-react';

export default function Grades({ studyResult, grades, student, name = null }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="purple" size="sm">
                    <IconEye className="size-4 text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top">
                <SheetHeader>
                    <SheetTitle>Detail Kartu Hasil Studi Mahasiswa {name}</SheetTitle>
                    <SheetDescription>Detail Kartu Hasil Studi Mahasiswa</SheetDescription>
                </SheetHeader>
                <Table className="w-full border">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border">No</TableHead>
                            <TableHead className="border">Kode</TableHead>
                            <TableHead className="border">MataKuliah</TableHead>
                            <TableHead className="border">SKS</TableHead>
                            <TableHead className="border">Huruf Mutu</TableHead>
                            <TableHead className="border">Bobot</TableHead>
                            <TableHead className="border">Nilai</TableHead>
                            <TableHead className="border text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades?.map((item, index) => {
                            const isGraded = item.letter && item.letter !== '-';
                            return (
                                <TableRow key={index}>
                                    <TableCell className="border">{index + 1}</TableCell>
                                    <TableCell className="border">{item.course?.code}</TableCell>
                                    <TableCell className="border">{item.course?.name}</TableCell>
                                    <TableCell className="border">{item.course?.credit}</TableCell>
                                    <TableCell className="border font-semibold">{item.letter}</TableCell>
                                    <TableCell className="border">{item.weight_of_value}</TableCell>
                                    <TableCell className="border font-medium">{item.grade}</TableCell>
                                    <TableCell className="border text-center">
                                        {isGraded ? (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                Sudah Dinilai
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                Belum Dinilai
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter className="font-bold">
                        <TableRow>
                            <TableCell colSpan="3">IP Semester</TableCell>
                            <TableCell className="border">{studyResult.gpa}</TableCell>
                            <TableCell className="border"></TableCell>
                            <TableCell className="border"></TableCell>
                            <TableCell className="border"></TableCell>
                            <TableCell className="border"></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </SheetContent>
        </Sheet>
    );
}
