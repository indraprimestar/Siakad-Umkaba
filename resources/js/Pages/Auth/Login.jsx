import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const onHundleSubmit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex flex-col px-6 py-4">
                <img
                    src="https://upload.wikimedia.org/wikipedia/id/a/a9/Logo-UMKABA.png"
                    alt="UMKABA"
                    className="h-10 w-auto self-start object-contain" // ← biar tidak gepeng & tidak bulat
                />
                {/* <ApplicationLogo 
                    bgLogo='from-blue-500 via-blue-600 to-blue-600' 
                    colorLogo='text-white' 
                    colorText='text-white' 
                /> */}
                <div className="flex flex-col items-center justify-center py-12 lg:py-20">
                    {/* kalau di contoh itu 48 */}
                    <div className="mx-auto flex w-full flex-col gap-6 lg:w-1/2">
                        <div className="grid gap-2 text-center">
                            {status && (
                                <Alert variant="success">
                                    <AlertDescription>{status}</AlertDescription>
                                </Alert>
                            )}
                            <h1 className="text-3xl font-bold text-foreground">Silahkan Masuk</h1>
                            <p className="text-balance text-muted-foreground">
                                Silahkan masukkan email dan password anda dibawah ini
                            </p>
                        </div>
                        <form onSubmit={onHundleSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email :</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        placeholder="nama@mail.umkaba.ac.id"
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {errors.email && <InputError message={errors.email} />}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password :</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {errors.password && <InputError message={errors.password} />}
                                </div>
                                <div className="grid gap-2">
                                    <div className="items-top flex space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData('remember', checked)}
                                        />
                                        <div className="leading-non grid gap-1.5">
                                            <Label htmlFor="remember">Ingatkan Saya</Label>
                                        </div>
                                    </div>
                                    {errors.remember && <InputError message={errors.remember} />}
                                </div>
                                <Button type="submit" variant="blue" size="xl" className="w-full" disabled={processing}>
                                    Masuk
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:block">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWcQ2lH0MXLHCCw04skPRgOeovdeJp_aHBZQbYij-UA05VJfEaLHZBwdI&s=10"
                    alt="Gedung UMKABA"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}

Login.layout = (page) => <GuestLayout children={page} title="Login" />;
