import React, { useEffect, useState } from "react";
import { MATERIALS } from "../../lib/materials";
import Mattress3DView from "./Mattress3DView";
import MaterialSelector from "./MaterialSelector";
import PriceBreakdown from "./PriceBreakdown";
import { Button } from '../ui/button';
import {
  calculateMattressPrice,
  MattressLayer,
  PriceCalculationResponse,
} from "../../lib/api";
import "./MattressCustomizer.css";

const defaultLayer = (id = "foam", thickness_mm = 50): MattressLayer => ({
  materialId: id,
  thickness_mm,
});

// Unit conversion functions
const convertLength = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to cm first
  let valueCm = value;
  if (fromUnit === "inches") valueCm = value * 2.54;
  if (fromUnit === "feet") valueCm = value * 30.48;

  // Convert from cm to target unit
  if (toUnit === "cm") return valueCm;
  if (toUnit === "inches") return valueCm / 2.54;
  if (toUnit === "feet") return valueCm / 30.48;
  return value;
};

type UnitType = "cm" | "inches" | "feet";

export default function MattressBuilder() {
  const [lengthValue, setLengthValue] = useState<number>(200);
  const [widthValue, setWidthValue] = useState<number>(150);
  const [unit, setUnit] = useState<UnitType>("cm");
  const [layers, setLayers] = useState<MattressLayer[]>([
    defaultLayer("memory", 40),
    defaultLayer("foam", 60),
  ]);
  const [priceData, setPriceData] = useState<PriceCalculationResponse | null>(
    null
  );
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null);

  // Convert displayed values to cm for API and calculations
  const lengthCm = convertLength(lengthValue, unit, "cm");
  const widthCm = convertLength(widthValue, unit, "cm");

  // Add layer
  const addLayer = () =>
    setLayers((prev) => [...prev, defaultLayer("foam", 50)]);

  // Remove a layer by index
  const removeLayer = (idx: number) =>
    setLayers((prev) => prev.filter((_, i) => i !== idx));

  // Update layer
  const updateLayer = (idx: number, patch: Partial<MattressLayer>) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, ...patch } : l))
    );
  };

  // Handle unit change
  const handleUnitChange = (newUnit: UnitType) => {
    // Convert current values to the new unit
    setLengthValue(
      Number(convertLength(lengthValue, unit, newUnit).toFixed(1))
    );
    setWidthValue(Number(convertLength(widthValue, unit, newUnit).toFixed(1)));
    setUnit(newUnit);
  };

  // Apply cloth to mattress
  const applyCloth = (clothId: string) => {
    setSelectedCloth(clothId);
    // Find if there's already a cloth layer
    const clothLayerIndex = layers.findIndex((l) =>
      l.materialId.startsWith("d")
    );

    if (clothLayerIndex >= 0) {
      // Update existing cloth layer
      updateLayer(clothLayerIndex, { materialId: clothId });
    } else {
      // Add new cloth layer at the top
      setLayers((prev) => [...prev, defaultLayer(clothId, 10)]);
    }
  };

  const calculatePrice = async () => {
    setLoadingPrice(true);
    try {
      const data = await calculateMattressPrice({
        length_cm: lengthCm,
        width_cm: widthCm,
        layers,
      });
      setPriceData(data);
    } catch (err) {
      console.error(err);
      alert("Price calculation failed. Is the server running?");
    } finally {
      setLoadingPrice(false);
    }
  };

  // auto calculate when layers change (with debounce)
  useEffect(() => {
    const t = setTimeout(() => calculatePrice(), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, lengthCm, widthCm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mattress-customizer">
      {/* Left Panel */}
      <div className="lg:col-span-1 space-y-6">
        {/* Cloth Selection Section */}
        <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Mattress Cover
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Select a cover fabric for your mattress:
          </p>

          <MaterialSelector
            value={selectedCloth || "d1"}
            onChange={applyCloth}
            type="cloth"
          />
        </div>

        {/* Layers Section */}
        <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Mattress Layers
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Build your mattress from the bottom up:
          </p>

          <div className="space-y-4">
            {layers
              .filter((layer) => !layer.materialId.startsWith("d"))
              .map((layer, idx) => {
                const mat = MATERIALS.find((m) => m.id === layer.materialId);
                return (
                  <div
                    className="layer-card bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
                    key={idx}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ background: mat ? mat.color : "#999" }}
                        />
                        <span className="font-medium text-gray-700">
                          Layer {idx + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => removeLayer(idx)}
                        className="remove-layer-button p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="col-span-2">
                        <MaterialSelector
                          value={layer.materialId}
                          onChange={(matId) =>
                            updateLayer(idx, { materialId: matId })
                          }
                          type="layer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Thickness
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="1"
                            value={layer.thickness_mm}
                            onChange={(e) =>
                              updateLayer(idx, {
                                thickness_mm: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          />
                          <span className="ml-1 text-sm text-gray-500">mm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Add Layer Button */}
            <button
              onClick={addLayer}
              className="add-layer-button animated-button w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-black font-medium rounded-md hover:from-green-600 hover:to-green-700 shadow-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Layer
            </button>
          </div>
        </div>
        <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Save Design</Button>
      </div>

      {/* 3D View Section */}
      <div className="mattress-3d-container lg:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">

        <div style={{ height: "600px" }}>
          <Mattress3DView
            lengthCm={lengthCm}
            widthCm={widthCm}
            layers={layers}
            materials={MATERIALS}
            unit={unit}
          />
        </div>
        {/* Dimensions Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-gray-800">
              🧩 Dimensions
            </h3>
            <span className="text-xs text-gray-400">Customize size</span>
          </div>

          {/* Unit Selector */}
          <div className="flex justify-between mb-6 bg-gray-100 p-1 rounded-xl">
            {(["cm", "inches", "feet"] as UnitType[]).map((unitOption) => (
              <button
                key={unitOption}
                onClick={() => handleUnitChange(unitOption)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  unit === unitOption
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-300"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                {unitOption.charAt(0).toUpperCase() + unitOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-6">
            {/* Length */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={lengthValue}
                  onChange={(e) => setLengthValue(Number(e.target.value))}
                  className="w-full px-3 py-2.5 pl-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 group-hover:shadow-sm"
                  placeholder={`Enter length in ${unit}`}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  {unit}
                </span>
              </div>
            </div>

            {/* Width */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={widthValue}
                  onChange={(e) => setWidthValue(Number(e.target.value))}
                  className="w-full px-3 py-2.5 pl-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 group-hover:shadow-sm"
                  placeholder={`Enter width in ${unit}`}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  {unit}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Price Breakdown */}
        <PriceBreakdown data={priceData} />
      </div>
    </div>
  );
}
