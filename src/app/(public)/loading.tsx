import { ZLoader } from "@/components/kit/z-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ZLoader />
    </div>
  );
}
