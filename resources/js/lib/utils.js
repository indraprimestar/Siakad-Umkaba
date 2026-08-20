// resources/js/lib/utils.js (misal taruh di sini)
import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
//import { id as localeID } from 'date-fns/locale'; // ← locale Indo
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function flashMessage(params) {
    return params.props?.flash_message;
}

export const deleteAction = (url, { closeModal, ...options } = {}) => {
    const defaultOptions = {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            if (typeof closeModal === 'function') closeModal();
        },
        ...options,
    };
    router.delete(url, defaultOptions);
};

export const formatDateIndo = (dateString) => {
    return format(parseISO(dateString), 'eeee, dd MMMM yyyy', { locale: id });
};

export const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export const STUDYPLANSTATUS = { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED' };
export const STUDYPLANSTATUSVARIANT = {
    [STUDYPLANSTATUS.PENDING]: 'secondary',
    [STUDYPLANSTATUS.APPROVED]: 'success',
    [STUDYPLANSTATUS.REJECTED]: 'destructive',
};

export const FEESTATUS = { PENDING: 'Tertunda', SUCCESS: 'Berhasil', FAILED: 'Gagal' };
export const FEESTATUSVARIANT = {
    [FEESTATUS.PENDING]: 'secondary',
    [FEESTATUS.SUCCESS]: 'success',
    [FEESTATUS.FAILED]: 'destructive',
};

export const feeCodeGenerator = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
