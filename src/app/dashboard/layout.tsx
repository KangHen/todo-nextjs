import DefaultLayout from '@/components/layout/DefaultLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout>{children}</DefaultLayout>;
}