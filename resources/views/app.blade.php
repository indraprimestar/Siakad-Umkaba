{{-- resources/views/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_','-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia>{{ config('app.name', 'Laravel') }}</title>

  {{-- Ziggy: ekspor named routes ke JS (window.Ziggy) --}}
  @routes

  {{-- Vite HMR (dev only) --}}
  @viteReactRefresh

  {{-- Entry utama front-end (cukup app.jsx saja) --}}
  @vite('resources/js/app.jsx')

  {{-- Head yang dikontrol Inertia (title, meta, dll) --}}
  @inertiaHead
  <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="{{ config('services.midtrans.client_key') }}"></script>
</head>
<body class="font-sans antialiased min-h-dvh overflow-y-auto">
  @inertia
</body>
</html>



