"use client";

interface DownloadTemplateProps {
  filename: string;
  content: string;
}

export default function DownloadTemplate({ filename, content }: DownloadTemplateProps) {
  const download = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={download} className="btn-primary !py-[10px] !px-[18px] !text-[12.5px]">
        Download (.md)
      </button>
      <button onClick={copy} className="btn-secondary !py-[10px] !px-[18px] !text-[12.5px]">
        Copy Template
      </button>
    </div>
  );
}
