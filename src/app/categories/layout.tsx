import DefaultLayout from '@/components/layout/DefaultLayout';

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout>{children}</DefaultLayout>;
}