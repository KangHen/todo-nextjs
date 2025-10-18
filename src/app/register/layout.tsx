import GuestLayout from '@/components/layout/GuestLayout';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestLayout>{children}</GuestLayout>;
}