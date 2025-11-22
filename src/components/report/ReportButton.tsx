import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportTemplate } from './ReportTemplate';
import { useProject } from '../../lib/project-context';

interface ReportButtonProps {
  getStageDataURL: () => string | null;
}

export function ReportButton({ getStageDataURL }: ReportButtonProps) {
  const { projectName, clientName } = useProject();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      
      // 1. Get the floorplan image from the stage
      const stageDataURL = getStageDataURL();
      if (!stageDataURL) {
        console.error('Failed to get stage data URL');
        return;
      }

      // 2. Create a temporary container for the report
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // 3. Render the template
      const root = createRoot(container);
      const dateStr = new Date().toLocaleDateString();
      
      // We need to wrap this in a promise to wait for render
      await new Promise<void>((resolve) => {
        root.render(
          <ReportTemplate
            projectName={projectName}
            clientName={clientName}
            image={stageDataURL}
            date={dateStr}
            ref={(el) => {
              if (el) {
                // Give it a moment to render images
                setTimeout(resolve, 500);
              }
            }}
          />
        );
      });

      // 4. Capture with html2canvas
      // We target the first child of the container which is the ReportTemplate div
      const element = container.firstElementChild as HTMLElement;
      if (!element) throw new Error('Report element not found');

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
      });

      // 5. Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${projectName.replace(/\s+/g, '_')}_Report.pdf`);

      // 6. Cleanup
      root.unmount();
      document.body.removeChild(container);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateReport}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FileText size={16} />
          <span>Generate Report</span>
        </>
      )}
    </button>
  );
}
