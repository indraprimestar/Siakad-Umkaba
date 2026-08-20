//import React from "react";
//import { useToast } from "@/hooks/use-toast"; // atau "../hooks/use-toast" kalau alias @ belum ada
//import { useToast } from "../hooks/use-toast";

//export default function ExamplePage() {
//  const { toast } = useToast();

//  const handleClick = () => {
//    toast.success("Data berhasil disimpan!");
//  };

//  return (
//    <div style={{ padding: "20px" }}>
//      <h1>Contoh Page Toast</h1>
//      <button onClick={handleClick}>Klik untuk toast</button>
//    </div>
//  );
//}

//export default function ExamplePage() {
//  return (
//    <div style={{ padding: 20 }}>
//      <h1>HALO — Inertia jalan 🎉</h1>
//    </div>
//  );
//}

import { toast } from 'sonner';

export default function ExamplePage() {
    return (
        <div style={{ padding: 20 }}>
            <h1>HALO — Inertia jalan 🎉</h1>
            <button onClick={() => toast.success('Data berhasil disimpan!')}>Klik untuk toast</button>
        </div>
    );
}
