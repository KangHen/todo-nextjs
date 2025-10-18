import GuestLayout from '@/components/layout/GuestLayout';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestLayout>{children}</GuestLayout>;
}