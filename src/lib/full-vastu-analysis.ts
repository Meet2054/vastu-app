/**
 * Comprehensive Vastu Analysis System
 * Integrates all 26 Vastu analysis modules
 */

import { Point } from './vastu/types';

// Import all analysis modules
import { generateMVastuSquareGrid } from './vastu/mvastu-square-grid';
import { generateAdvanceMarma } from './vastu/advance-marma';
import { generateShubhDwar } from './vastu/shubh-dwar';
import { generateVPM } from './vastu/vpm';
import { generateShaktiChakra } from './vastu/shakti-chakra';
import { generateMVastuChakra } from './vastu/mvastu-chakra';
import { generateTriDosha } from './vastu/tri-dosha';
import { generateTriGuna } from './vastu/tri-guna';
import { generatePanchatatva } from './vastu/panchatatva';
import { generateDevtaKhanij } from './vastu/devta-khanij';
import { generateMahuratVichar } from './vastu/mahurat-vichar';
import { generateDishaGandh } from './vastu/disha-gandh';
import { generateZones9x9 } from './vastu/zones-9x9';
import { generateDevtaBhojan } from './vastu/devta-bhojan';
import { generateDevtaNighath } from './vastu/devta-nighath';
import { generateNighathuArth } from './vastu/nighathu-arth';
import { generateDevtaChinha } from './vastu/devta-chinha';
import { generateKhanijDhatu } from './vastu/khanij-dhatu';
import { generateDivisionOfDevta } from './vastu/division-of-devta';
import { generateDevtaChinhaAadi } from './vastu/devta-chinha-aadi';
import { generateDevtaBhojanAadi } from './vastu/devta-bhojan-aadi';
import { generateCircleGrid } from './vastu/circle-grid';
import { generateSeharumukhAchintyaVibhav } from './vastu/seharumukh-achintya-vibhav';
import { generateMenna } from './vastu/menna';

export interface VastuAnalysisOptions {
  // Modern Vastu
  mvastuSquareGrid?: boolean;
  advanceMarma?: boolean;
  shunyabhanti?: boolean;
  shubhDwar?: boolean;
  vpm?: boolean;
  shaktiChakra?: boolean;
  mvastuChakra?: boolean;
  triDoshaDevision?: boolean;
  triGunaDevision?: boolean;
  panchtattvaDevision?: boolean;
  menna?: boolean;
  
  // Division Devta
  devisonOfDevta?: boolean;
  devisonOfDevtaBarChart?: boolean;
  
  // Vedic Vastu - 8 Division
  devtaKhanj?: boolean;
  mahuratVichar?: boolean;
  dishaGandh?: boolean;
  nineXNineZones?: boolean;
  
  // 16 Division
  devtaBhojan?: boolean;
  nighathuArth?: boolean;
  khanjDhatu?: boolean;
  
  // 32 Division
  devtaChinhaAadi?: boolean;
  circleGrid?: boolean;
  seharumukh?: boolean;
  
  // Additional
  devtaBhojanAadi?: boolean;
  devtaNighath?: boolean;
  devtaChintha?: boolean;
}

export interface AnalysisResult {
  name: string;
  type: string;
  data: unknown;
  recommendations: string[];
  summary?: string;
}

/**
 * Generate comprehensive Vastu analysis based on selected options
 */
export async function generateComprehensiveAnalysis(
  boundaryPoints: Point[],
  options: VastuAnalysisOptions
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];
  
  if (!boundaryPoints || boundaryPoints.length < 3) {
    throw new Error('Invalid boundary points. At least 3 points are required.');
  }
  
  try {
    // Modern Vastu Analyses (Modules 1-10)
    if (options.mvastuSquareGrid) {
      const result = generateMVastuSquareGrid(boundaryPoints);
      results.push({
        name: 'M-Vastu Square Grid (16 Zones)',
        type: 'm-vastu-square-grid',
        data: result.data,
        recommendations: result.data.imbalances.map(i => i.recommendation),
        summary: `Grid Size: ${result.data.gridSize}, Imbalances: ${result.data.imbalances.length}`
      });
    }
    
    if (options.advanceMarma) {
      const result = generateAdvanceMarma(boundaryPoints);
      results.push({
        name: 'Advance Marma Points',
        type: 'advance-marma',
        data: result.data,
        recommendations: result.data.recommendations || [],
        summary: `Affected Points: ${result.data.affectedPoints.length}, Critical: ${result.data.criticalAffected}, Severity: ${result.data.totalSeverityScore}`
      });
    }
    
    if (options.shubhDwar) {
      const result = generateShubhDwar(boundaryPoints);
      results.push({
        name: 'Shubh Dwar (Auspicious Entrance)',
        type: 'shubh-dwar',
        data: result.data,
        recommendations: result.data.alternativeEntrances.map(alt => 
          `${alt.direction} direction: ${alt.auspiciousness} (Score: ${alt.score})`
        ),
        summary: `Auspiciousness: ${result.data.entrance.auspiciousness}, Alternatives: ${result.data.alternativeEntrances.length}`
      });
    }
    
    if (options.vpm) {
      const result = generateVPM(boundaryPoints);
      results.push({
        name: 'Vastu Purush Mandal (81 Zones)',
        type: 'vpm',
        data: result.data,
        recommendations: result.data.recommendations || [],
        summary: `Core Vastu Score: ${result.data.coreVastuScore}/100, Violations: ${result.data.violations.length}`
      });
    }
    
    if (options.shaktiChakra) {
      const result = generateShaktiChakra(boundaryPoints);
      results.push({
        name: 'Shakti Chakra',
        type: 'shakti-chakra',
        data: result.data,
        recommendations: result.data.flowImbalance.map(imb => 
          `${imb.direction}: ${imb.issue} (${imb.severity}) - ${imb.remedy}`
        ),
        summary: `Overall Flow: ${result.data.overallFlow}/100, Imbalances: ${result.data.flowImbalance.length}`
      });
    }
    
    if (options.mvastuChakra) {
      const result = generateMVastuChakra(boundaryPoints);
      results.push({
        name: 'M-Vastu Chakra',
        type: 'm-vastu-chakra',
        data: result.data,
        recommendations: result.data.recommendations || [],
        summary: `Circular Harmony: ${result.data.circularHarmonyScore}/100, Rings: ${result.data.rings.length}`
      });
    }
    
    if (options.triDoshaDevision) {
      const result = generateTriDosha(boundaryPoints);
      results.push({
        name: 'Tri Dosha Division (Vata-Pitta-Kapha)',
        type: 'tri-dosha-devision',
        data: result.data,
        recommendations: result.data.recommendations || [],
        summary: `Dosha Balance: ${result.data.overallBalance}/100`
      });
    }
    
    if (options.triGunaDevision) {
      const result = generateTriGuna(boundaryPoints);
      results.push({
        name: 'Tri Guna Division (Sattva-Rajas-Tamas)',
        type: 'tri-guna-devision',
        data: result.data,
        recommendations: result.data.recommendations || [],
        summary: `Guna Balance: ${result.data.overallBalance}/100`
      });
    }
    
    if (options.panchtattvaDevision) {
      const result = generatePanchatatva(boundaryPoints);
      results.push({
        name: 'Panchatatva Division (5 Elements)',
        type: 'panchtattva-devision',
        data: result.data,
        recommendations: result.data.recommendations || [],
        summary: `Element Balance: ${result.data.overallBalance}/100`
      });
    }
    
    // Vedic Vastu - 8 Division (Modules 11-14)
    if (options.devtaKhanj) {
      const result = generateDevtaKhanij(boundaryPoints);
      results.push({
        name: 'Devta + Khanj (8 Divisions)',
        type: 'devta-khanj',
        data: result.data,
        recommendations: [
          ...result.data.mineralRemedies.map(r => `${r.direction}: ${r.mineral} - ${r.purpose}`),
          ...result.data.devtaAppeasement.map(d => `${d.devta} (${d.direction}): ${d.remedy}`)
        ],
        summary: `Prosperity: ${result.data.overallProsperity}/100, Mineral Harmony: ${result.data.mineralHarmony}/100`
      });
    }
    
    if (options.mahuratVichar) {
      const result = generateMahuratVichar(boundaryPoints);
      results.push({
        name: 'Mahurat Vichar',
        type: 'mahurat-vichar',
        data: result.data,
        recommendations: result.data.activityRecommendations.map(rec => 
          `${rec.activity}: ${rec.favorability})`
        ),
        summary: `Overall Favorability: ${result.data.overallFavorability}/100, Season: ${result.data.currentSeason}`
      });
    }
    
    if (options.dishaGandh) {
      const result = generateDishaGandh(boundaryPoints);
      results.push({
        name: 'Disha + Gandh',
        type: 'disha-gandh',
        data: result.data,
        recommendations: result.data.aromaticRemedies.map(rem => 
          `${rem.direction}: ${rem.recommendedAroma} - ${rem.application}`
        ),
        summary: `Comfort: ${result.data.overallComfort}/100, Sensory Harmony: ${result.data.sensoryHarmony}/100`
      });
    }
    
    if (options.nineXNineZones) {
      const result = generateZones9x9(boundaryPoints);
      results.push({
        name: '9×9 Zones Division',
        type: 'nine-x-nine-zones',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Micro-Zone Score: ${result.data.microZoneScore}/100`
      });
    }
    
    // 16 Division (Modules 15-17)
    if (options.devtaBhojan) {
      const result = generateDevtaBhojan(boundaryPoints);
      results.push({
        name: 'Devta + Bhojan (16 Divisions)',
        type: 'devta-bhojan',
        data: result.data,
        recommendations: result.data.remedialMeasures.map(rem => 
          `${rem.issue}: ${rem.remedy} (Priority: ${rem.priority})`
        ),
        summary: `Food Zone Sectors: ${result.data.sectors.length}, Remedial Measures: ${result.data.remedialMeasures.length}`
      });
    }
    
    if (options.devtaNighath) {
      const result = generateDevtaNighath(boundaryPoints);
      results.push({
        name: 'Devta + Nighath',
        type: 'devta-nighath',
        data: result.data,
        recommendations: result.data.preventiveMeasures.map((meas: { zone: string; lossType: string; action: string; urgency: string }) => 
          `${meas.zone} (${meas.lossType}): ${meas.action} - Urgency: ${meas.urgency}`
        ),
        summary: `Loss Risk: ${result.data.overallLossRisk}/100, Critical Zones: ${result.data.criticalLossZones.length}`
      });
    }
    
    if (options.nighathuArth) {
      const result = generateNighathuArth(boundaryPoints);
      results.push({
        name: 'Nighathu + Arth (Loss vs Gain)',
        type: 'nighathu-arth',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Financial Health: ${result.data.overallFinancialHealth}/100, Wealth Flow: ${result.data.wealthFlowIndex}/100`
      });
    }
    
    if (options.devtaChintha) {
      const result = generateDevtaChinha(boundaryPoints);
      results.push({
        name: 'Devta Chinha (Symbolic Indicators)',
        type: 'devta-chinha',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Symbolic Harmony: ${result.data.overallSymbolicHarmony}/100`
      });
    }
    
    if (options.khanjDhatu) {
      const result = generateKhanijDhatu(boundaryPoints);
      results.push({
        name: 'Khanij + Dhatu (Mineral-Metal Harmony)',
        type: 'khanij-dhatu',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Material Harmony: ${result.data.overallMaterialHarmony}/100, Structural Integrity: ${result.data.structuralIntegrity}/100`
      });
    }
    
    // Division of Devta (Module 21)
    if (options.devisonOfDevta || options.devisonOfDevtaBarChart) {
      const result = generateDivisionOfDevta(boundaryPoints);
      results.push({
        name: 'Division of Devta (32 Zones)',
        type: 'division-of-devta',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Overall Balance: ${result.data.overallBalance}/100, Harmony Index: ${result.data.harmonyIndex}/100`
      });
    }
    
    // 32 Division (Modules 22, 24, 25)
    if (options.devtaChinhaAadi) {
      const result = generateDevtaChinhaAadi(boundaryPoints);
      results.push({
        name: 'Devta Chinha Aadi (Extended Symbolic Reading)',
        type: 'devta-chinha-aadi',
        data: result.data,
        recommendations: result.data.priorityRemediation.map(rem => 
          `${rem.zone} (${rem.direction}): ${rem.action}`
        ),
        summary: `Symbolic Coherence: ${result.data.symbolicCoherence.overallCoherence}/100, Conflicts: ${result.data.crossLayerConflicts.length}`
      });
    }
    
    if (options.circleGrid) {
      const result = generateCircleGrid(boundaryPoints);
      results.push({
        name: 'Circle Grid (Pure Circular Balance)',
        type: 'circle-grid',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Symmetry Score: ${result.data.overallSymmetryScore}/100`
      });
    }
    
    if (options.seharumukh) {
      const result = generateSeharumukhAchintyaVibhav(boundaryPoints);
      results.push({
        name: 'Seharumukh Achintya Vibhav (Advanced Intangible Analysis)',
        type: 'seharumukh-achintya-vibhav',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Intangible Harmony: ${result.data.overallIntangibleHarmony}/100, Expert Insights: ${result.data.expertInsights.length}`
      });
    }
    
    // Additional Analyses (Module 23, 26)
    if (options.devtaBhojanAadi) {
      const result = generateDevtaBhojanAadi(boundaryPoints);
      results.push({
        name: 'Devta Bhojan Aadi (Extended Nourishment)',
        type: 'devta-bhojan-aadi',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Wellness Score: ${result.data.overallWellnessScore}/100, Health Index: ${result.data.overallHealthIndex}/100`
      });
    }
    
    if (options.menna) {
      const result = generateMenna(boundaryPoints);
      results.push({
        name: 'Menna (Area Balance Analysis)',
        type: 'menna',
        data: result.data,
        recommendations: result.recommendations || [],
        summary: `Balance Index: ${result.data.balanceIndex}/100, Corrections Needed: ${result.data.priorityCorrectionZones.length}`
      });
    }
    
    return results;
    
  } catch (error) {
    console.error('Error generating Vastu analysis:', error);
    throw error;
  }
}

/**
 * Get display name for analysis option
 */
export function getAnalysisDisplayName(optionKey: string): string {
  const nameMap: { [key: string]: string } = {
    mvastuSquareGrid: 'M-Vastu Square Grid (16 Zones)',
    advanceMarma: 'Advance Marma Points',
    shunyabhanti: 'Shunyabhanti Analysis',
    shubhDwar: 'Shubh Dwar (Auspicious Entrance)',
    vpm: 'Vastu Purush Mandal (81 Zones)',
    shaktiChakra: 'Shakti Chakra',
    mvastuChakra: 'M-Vastu Chakra',
    triDoshaDevision: 'Tri Dosha Division',
    triGunaDevision: 'Tri Guna Division',
    panchtattvaDevision: 'Panchatatva Division (5 Elements)',
    menna: 'Menna (Area Balance)',
    devisonOfDevta: 'Division of Devta',
    devisonOfDevtaBarChart: 'Devta Bar Chart',
    devtaKhanj: 'Devta + Khanj (8 Division)',
    mahuratVichar: 'Mahurat Vichar',
    dishaGandh: 'Disha + Gandh',
    nineXNineZones: '9×9 Zones Division',
    devtaBhojan: 'Devta + Bhojan (16 Division)',
    nighathuArth: 'Nighathu + Arth (Loss vs Gain)',
    khanjDhatu: 'Khanij + Dhatu (Mineral-Metal)',
    devtaChinhaAadi: 'Devta Chinha Aadi (32 Division)',
    circleGrid: 'Circle Grid',
    seharumukh: 'Seharumukh Achintya Vibhav',
    devtaBhojanAadi: 'Devta Bhojan Aadi',
    devtaNighath: 'Devta + Nighath',
    devtaChintha: 'Devta Chinha',
  };
  
  return nameMap[optionKey] || optionKey;
}
