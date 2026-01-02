import { useState } from "react";
import { X } from "lucide-react";

interface ReportOptions {
  // Modern Vastu
  mvastuSquareGrid: boolean;
  advanceMarma: boolean;
  shunyabhanti: boolean;
  shubhDwar: boolean;
  vpm: boolean;
  shaktiChakra: boolean;
  mvastuChakra: boolean;
  triDoshaDevision: boolean;
  triGunaDevision: boolean;
  panchtattvaDevision: boolean;
  menna: boolean;
  // Devison Devta
  devisonOfDevta: boolean;
  devisonOfDevtaBarChart: boolean;
  // dic Vastu - 8 Division
  devtaKhanj: boolean;
  mahuratVichar: boolean;
  dishaGandh: boolean;
  nineXNineZones: boolean;
  // 16 Division
  devtaBhojan: boolean;
  nighathuArth: boolean;
  khanjDhatu: boolean;
  // 32 Division
  devtaChinhaAadi: boolean;
  circleGrid: boolean;
  seharumukh: boolean;
  // Devta Bhojan Aadi
  devtaBhojanAadi: boolean;
  devtaNighath: boolean;
  devtaChintha: boolean;
}

interface FullReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: ReportOptions) => void;
}

export function FullReportModal({
  isOpen,
  onClose,
  onGenerate,
}: FullReportModalProps) {
  const [options, setOptions] = useState<ReportOptions>({
    // Modern Vastu
    mvastuSquareGrid: false,
    advanceMarma: false,
    shunyabhanti: false,
    shubhDwar: false,
    vpm: false,
    shaktiChakra: false,
    mvastuChakra: false,
    triDoshaDevision: false,
    triGunaDevision: false,
    panchtattvaDevision: false,
    menna: false,
    // Devison Devta
    devisonOfDevta: false,
    devisonOfDevtaBarChart: false,
    // dic Vastu - 8 Division
    devtaKhanj: false,
    mahuratVichar: false,
    dishaGandh: false,
    nineXNineZones: false,
    // 16 Division
    devtaBhojan: false,
    nighathuArth: false,
    khanjDhatu: false,
    // 32 Division
    devtaChinhaAadi: false,
    circleGrid: false,
    seharumukh: false,
    // Devta Bhojan Aadi
    devtaBhojanAadi: false,
    devtaNighath: false,
    devtaChintha: false,
  });

  const toggleOption = (key: keyof ReportOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    setOptions({
      mvastuSquareGrid: true,
      advanceMarma: true,
      shunyabhanti: true,
      shubhDwar: true,
      vpm: true,
      shaktiChakra: true,
      mvastuChakra: true,
      triDoshaDevision: true,
      triGunaDevision: true,
      panchtattvaDevision: true,
      menna: true,
      devisonOfDevta: true,
      devisonOfDevtaBarChart: true,
      devtaKhanj: true,
      mahuratVichar: true,
      dishaGandh: true,
      nineXNineZones: true,
      devtaBhojan: true,
      nighathuArth: true,
      khanjDhatu: true,
      devtaChinhaAadi: true,
      circleGrid: true,
      seharumukh: true,
      devtaBhojanAadi: true,
      devtaNighath: true,
      devtaChintha: true,
    });
  };

  const deselectAll = () => {
    setOptions({
      mvastuSquareGrid: false,
      advanceMarma: false,
      shunyabhanti: false,
      shubhDwar: false,
      vpm: false,
      shaktiChakra: false,
      mvastuChakra: false,
      triDoshaDevision: false,
      triGunaDevision: false,
      panchtattvaDevision: false,
      menna: false,
      devisonOfDevta: false,
      devisonOfDevtaBarChart: false,
      devtaKhanj: false,
      mahuratVichar: false,
      dishaGandh: false,
      nineXNineZones: false,
      devtaBhojan: false,
      nighathuArth: false,
      khanjDhatu: false,
      devtaChinhaAadi: false,
      circleGrid: false,
      seharumukh: false,
      devtaBhojanAadi: false,
      devtaNighath: false,
      devtaChintha: false,
    });
  };

  const allSelected = Object.values(options).every((value) => value === true);

  const toggleSelectAll = () => {
    if (allSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  const handleGenerate = () => {
    onGenerate(options);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Complete Report</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Modern Vastu */}
              <div>
                <h3 className="font-semibold mb-3">Modern Vastu</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.mvastuSquareGrid}
                      onChange={() => toggleOption("mvastuSquareGrid")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Mvastu Square Grid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.advanceMarma}
                      onChange={() => toggleOption("advanceMarma")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Advance Marma</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.shunyabhanti}
                      onChange={() => toggleOption("shunyabhanti")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Shunyabhanti</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.shubhDwar}
                      onChange={() => toggleOption("shubhDwar")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Shubh Dwar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.vpm}
                      onChange={() => toggleOption("vpm")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">VPM</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.shaktiChakra}
                      onChange={() => toggleOption("shaktiChakra")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Shakti Chakra</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.mvastuChakra}
                      onChange={() => toggleOption("mvastuChakra")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Mvastu Chakra</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.triDoshaDevision}
                      onChange={() => toggleOption("triDoshaDevision")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Tri Dosha Devision</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.triGunaDevision}
                      onChange={() => toggleOption("triGunaDevision")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Tri Guna Devision</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.panchtattvaDevision}
                      onChange={() => toggleOption("panchtattvaDevision")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Panchtattva Devision</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.menna}
                      onChange={() => toggleOption("menna")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Menna</span>
                  </label>
                </div>
              </div>

              {/* Devison Devta */}
              <div>
                <h3 className="font-semibold mb-3">Devison Devta</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devisonOfDevta}
                      onChange={() => toggleOption("devisonOfDevta")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devison of devta</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devisonOfDevtaBarChart}
                      onChange={() => toggleOption("devisonOfDevtaBarChart")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devison of devta Bar Chart</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* dic Vastu - 8 Division */}
              <div>
                <h3 className="font-semibold mb-3">Vedic Vastu</h3>
                <p className="font-semibold mb-3">8 Division</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devtaKhanj}
                      onChange={() => toggleOption("devtaKhanj")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devta + Khanj</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.mahuratVichar}
                      onChange={() => toggleOption("mahuratVichar")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Mahurat Vichar</span>
                  </label>
                </div>
              </div>

              {/* 16 Division */}
              <div>
                <h3 className="font-semibold mb-3">16 Division</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devtaBhojan}
                      onChange={() => toggleOption("devtaBhojan")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devta + Bhojan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.nighathuArth}
                      onChange={() => toggleOption("nighathuArth")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Nighathu + Arth</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.khanjDhatu}
                      onChange={() => toggleOption("khanjDhatu")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Khanj + Dhatu</span>
                  </label>
                </div>
              </div>

              {/* 32 Division */}
              <div>
                <h3 className="font-semibold mb-3">32 Division</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devtaChinhaAadi}
                      onChange={() => toggleOption("devtaChinhaAadi")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devta Chinha Aadi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.circleGrid}
                      onChange={() => toggleOption("circleGrid")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Circle Grid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.seharumukh}
                      onChange={() => toggleOption("seharumukh")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Seharumukh Achntya Vibhav</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-14 mt-16">
              {/* Devta Bhojan Aadi */}
              <div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.dishaGandh}
                      onChange={() => toggleOption("dishaGandh")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Disha + Gandh</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.nineXNineZones}
                      onChange={() => toggleOption("nineXNineZones")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">9 X 9 Zones Division</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devtaNighath}
                      onChange={() => toggleOption("devtaNighath")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devta + Nighath</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devtaChintha}
                      onChange={() => toggleOption("devtaChintha")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devta Chintha</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.devtaBhojanAadi}
                      onChange={() => toggleOption("devtaBhojanAadi")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Devta Bhojan Aadi</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>

          <div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
