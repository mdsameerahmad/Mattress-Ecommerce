import axios from 'axios';

export interface MattressLayer {
  materialId: string;
  thickness_mm: number;
}

export interface PriceCalculationRequest {
  length_cm: number;
  width_cm: number;
  layers: MattressLayer[];
}

export interface LayerBreakdown {
  materialId: string;
  materialName: string;
  thickness_mm: number;
  volume_m3: number;
  mass_kg: number;
  cost: number;
}

export interface PriceCalculationResponse {
  length_cm: number;
  width_cm: number;
  materialsCost: number;
  labor: number;
  margin: number;
  tax: number;
  total: number;
  layers: LayerBreakdown[];
}

// Configure the base URL for the API
const API_BASE_URL = 'http://localhost:4000';

/**
 * Calculate the price of a custom mattress
 * @param data The mattress configuration
 * @returns Price calculation response
 */
export async function calculateMattressPrice(data: PriceCalculationRequest): Promise<PriceCalculationResponse> {
  try {
    const response = await axios.post<PriceCalculationResponse>(
      `${API_BASE_URL}/api/calculate`, 
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error calculating mattress price:', error);
    throw error;
  }
}