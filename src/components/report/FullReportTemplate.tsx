import { forwardRef } from "react";

interface VastuLayerImage {
  name: string;
  image: string; // Data URL of canvas with layer overlay
}

interface FullReportTemplateProps {
  projectName: string;
  clientName: string;
  date: string;
  vastuLayerImages: VastuLayerImage[];
}

export const FullReportTemplate = forwardRef<
  HTMLDivElement,
  FullReportTemplateProps
>(({ projectName, clientName, date, vastuLayerImages }, ref) => {
  return (
    <div ref={ref} className="bg-white">
      {/* Cover Page */}
      <div
        className="flex flex-col"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "20mm",
          pageBreakAfter: "always",
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            Comprehensive Vastu Analysis Report
          </h1>
          <div className="w-32 h-1 bg-primary mb-8"></div>
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Project Name
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {projectName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Client Name
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {clientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Report Date
              </p>
              <p className="text-xl text-gray-700">{date}</p>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Vastu Power Advance. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Vastu Layer Pages - One page per layer */}
      {vastuLayerImages &&
        vastuLayerImages.map((layer, index) => (
          <div
            key={index}
            className="flex flex-col"
            style={{
              width: "210mm",
              height: "297mm",
              padding: "20mm",
              pageBreakAfter:
                index < vastuLayerImages.length - 1 ? "always" : "auto",
            }}
          >
            {/* Page Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{layer.name}</h2>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-600">{projectName}</p>
                <p className="text-sm text-gray-500">Page {index + 2}</p>
              </div>
            </div>

            {/* Floor Plan with Vastu Layer Overlay */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={layer.image}
                alt={`${layer.name} Overlay`}
                className="max-w-full max-h-full object-contain border-2 border-gray-200 rounded shadow-lg"
              />
            </div>

            {/* Footer with Layer Name */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>{layer.name}</p>
            </div>
          </div>
        ))}

      {/* Summary Page */}
      <div
        className="flex flex-col"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "20mm",
        }}
      >
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Report Summary</h2>
          <p className="text-sm text-gray-600 mt-2">{projectName}</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            This comprehensive Vastu analysis report contains{" "}
            {vastuLayerImages?.length || 0} visual Vastu layer overlays applied
            to your property floor plan.
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Analyzed Vastu Layers
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {vastuLayerImages &&
                vastuLayerImages.map((layer, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <h4 className="text-sm font-semibold text-gray-800">
                      {idx + 1}. {layer.name}
                    </h4>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-auto text-center text-sm text-gray-500">
          <p>End of Report</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Vastu Power Advance. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
});

FullReportTemplate.displayName = "FullReportTemplate";
