import React from 'react';

const DefaultTable = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto w-full">
      <div className="shadow-md sm:rounded-lg m-5 flex-grow">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="py-3 px-6">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-4 px-6">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefaultTable;
