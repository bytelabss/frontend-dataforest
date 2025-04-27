import React, { useEffect, useState } from 'react';
import { ReforestedArea } from '../shared/types';

interface SelectInputProps {
  onAreaSelected: (area: ReforestedArea | null) => void;
  apiUrl: string;
  defaultOptionText?: string;
}

const SelectInputComponent: React.FC<SelectInputProps> = ({
  onAreaSelected,
  apiUrl,
  defaultOptionText = 'Select a reforested area'
}) => {
  const [areas, setAreas] = useState<ReforestedArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const limit = 50;

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/reforested_areas?offset=${offset}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Add deduplication logic here
        setAreas(prevAreas => {
            const newAreas = data.filter((newArea: { id: string; }) => 
            !prevAreas.some(existingArea => existingArea.id === newArea.id)
            );
            return [...prevAreas, ...newAreas];
        });
        
        if (data.length === limit) {
          setOffset(prev => prev + limit);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [apiUrl, offset]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    if (!selectedId) {
      onAreaSelected(null);
      return;
    }
    const selectedArea = areas.find(area => area.id === selectedId);
    onAreaSelected(selectedArea || null);
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="select-container">
      <select 
        onChange={handleChange} 
        disabled={loading}
        className="area-select"
        aria-label="Reforested areas selector"
      >
        <option value="">{defaultOptionText}</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>
      {loading && <div className="loading-indicator">Loading more areas...</div>}
    </div>
  );
};

export default SelectInputComponent;