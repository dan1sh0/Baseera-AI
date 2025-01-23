import React from 'react';
import { Reference } from 'Sheikh-AI/src/types';

interface ReferencesProps {
  references: Reference[];
}

export const References = ({ references }: ReferencesProps) => {
  return (
    <div className="mt-4 pt-4 border-t">
      {references.map((ref, index) => (
        <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold text-green-700">{ref.citation}</p>
          <p className="text-right font-arabic my-2">{ref.arabic}</p>
          <p className="text-gray-700">{ref.english}</p>
        </div>
      ))}
    </div>
  );
}; 