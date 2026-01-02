import { forwardRef } from "react";
import { AnalysisResult } from "../../lib/full-vastu-analysis";

interface FullReportTemplateProps {
  projectName: string;
  clientName: string;
  date: string;
  floorPlanImage: string;
  analysisResults: AnalysisResult[];
}

export const FullReportTemplate = forwardRef<
  HTMLDivElement,
  FullReportTemplateProps
>(({ projectName, clientName, date, floorPlanImage, analysisResults }, ref) => {
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
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                This report contains {analysisResults?.length || 0}{" "}
                comprehensive Vastu analyses
              </p>
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

      {/* Analysis Pages */}
      {analysisResults &&
        analysisResults.map((analysis, index) => (
          <div
            key={index}
            className="flex flex-col"
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "20mm",
              pageBreakAfter:
                index < analysisResults.length - 1 ? "always" : "auto",
            }}
          >
            {/* Page Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {analysis.name}
              </h2>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-600">{projectName}</p>
                <p className="text-sm text-gray-500">Page {index + 2}</p>
              </div>
            </div>

            {/* Floor Plan Image */}
            <div className="mb-6">
              <img
                src={floorPlanImage}
                alt="Floor Plan"
                className="max-w-full h-auto object-contain border-2 border-gray-200 rounded"
                style={{ maxHeight: "120mm" }}
              />
            </div>

            {analysis.summary && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Summary
                </h3>
                <p className="text-sm text-gray-900">
                  {String(analysis.summary)}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations &&
              analysis.recommendations.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Key Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analysis.recommendations
                      .slice(0, 5)
                      .map((rec, recIndex) => (
                        <div key={recIndex} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    {analysis.recommendations.length > 5 && (
                      <p className="text-xs text-gray-500 italic">
                        ...and {analysis.recommendations.length - 5} more
                        recommendations
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Detailed Data Section */}
            {analysis.data && Object.keys(analysis.data).length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Analysis Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(analysis.data)
                    .filter(
                      ([, value]) =>
                        typeof value === "number" ||
                        typeof value === "string" ||
                        (Array.isArray(value) && value.length < 10)
                    )
                    .slice(0, 8)
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-gray-900 font-medium">
                          {Array.isArray(value) ? value.length : value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
          <h2 className="text-2xl font-bold text-gray-900">Analysis Summary</h2>
          <p className="text-sm text-gray-600 mt-2">{projectName}</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            This comprehensive Vastu analysis report contains{" "}
            {analysisResults?.length || 0} detailed analyses covering various
            aspects of Vastu Shastra principles applied to your property.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {analysisResults &&
              analysisResults.map((analysis, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <h4 className="text-sm font-semibold text-gray-800">
                    {analysis.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {analysis.summary || "N/A"}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto text-center text-sm text-gray-500">
          <p>End of Report</p>
        </div>
      </div>
    </div>
  );
});

FullReportTemplate.displayName = "FullReportTemplate";
