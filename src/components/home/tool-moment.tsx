import Link from "next/link";
import { ArrowRight, FileImage } from "lucide-react";

/** A real-looking tool result: what the image compressor shows after a run. The figures are an example, and the card says so. */
export function ToolMoment() {
  return (
    <div className="mb-10 grid items-center gap-8 rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h3 className="zq-display text-2xl font-semibold text-[#161513] sm:text-3xl">Compress an image without leaving the page</h3>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#5E5B55]">
          Drop in a photo, pick a quality and download the smaller file. It runs in your browser, so the original never leaves your device.
        </p>
        <Link href="/tools/image-compressor" className="zq-btn zq-btn-indigo mt-6">
          Open the image compressor <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <figure className="rounded-xl border border-[#E5E2DC] bg-[#F7F6F4] p-5" aria-label="Example result from the image compressor">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#5E5B55] ring-1 ring-[#E5E2DC]">
            <FileImage className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium text-[#161513]">product-photo.jpg</p>
            <p className="text-sm text-[#5E5B55]">Quality 80, JPEG</p>
          </div>
          <p className="zq-display text-3xl font-semibold tabular-nums text-[#D63A14]">-84%</p>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <div className="flex justify-between text-[#5E5B55]">
              <dt>Before</dt>
              <dd className="font-mono tabular-nums">2.4 MB</dd>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-[#CFCBC3]" />
          </div>
          <div>
            <div className="flex justify-between text-[#161513]">
              <dt>After</dt>
              <dd className="font-mono tabular-nums">380 KB</dd>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-[#E5E2DC]">
              <div className="h-2 rounded-full bg-[#D63A14]" style={{ width: "16%" }} />
            </div>
          </div>
        </dl>

        <figcaption className="mt-5 flex items-center gap-2 border-t border-[#E5E2DC] pt-4 text-sm text-[#5E5B55]">
          <span className="h-2 w-2 rounded-full bg-[#161513]" aria-hidden="true" />
          Processed on your device. Example figures.
        </figcaption>
      </figure>
    </div>
  );
}
