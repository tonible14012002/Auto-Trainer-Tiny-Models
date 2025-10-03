export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex-1 overflow-hidden flex flex-col">
      {children}
    </div>
  );
}
