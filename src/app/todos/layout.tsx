import DefaultLayout from '@/components/layout/DefaultLayout';

export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout>{children}</DefaultLayout>;
}