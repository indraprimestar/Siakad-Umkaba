<?php


namespace App\Enums;

enum FeeStatus: string {
    case PENDING = "Tertunda";

    case SUCCESS = "Sukses";

    case FAILED = "Gagal";
}
