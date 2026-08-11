interface ContainerProps {
  children?: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="w-220 h-fit flex flex-col gap-md z-index-front bg-blue-800 rounded-md p-lg dark font-['Helvetica']">
      {children}
    </div>
  );
}
