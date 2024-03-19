import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Charts from "../components/Charts";

export default function AnomalyReports() {
  const [anomalyReports, setAnomalyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentFile] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnomalyReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/recon/anomalyReport');
        setAnomalyReports(response.data);
      } catch (error) {
        console.error('Error fetching anomaly reports:', error);
        setError('Error fetching anomaly reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalyReports();
  }, []);

  const viewAnomalyReport = () => {
    navigate('/view-reports', { state: { anomalyReports } });
  }

  return (
    <div className="flex h-screen text-white bg-offWhite">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          <div className="col-sm-12 mt-4 rounded-lg border border-deepMidnight">
            <div className="max-w-9xl px-6 py-8 shadow-lg rounded-lg border bg-white">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                    <div className="p-2 ">
         v<div className="overflow-hidden border-b border-gray-200 shadow rounded-lg">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="dark:bg-gray-700 font-mono">
      <tr className="text-white bg-deepMidnight">
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase">Anomaly report file name</th>
        <th scope="col" className="px-6 py-3 text-right text-sm font-medium uppercase">Total unmatched payments</th>
        <th scope="col" className="px-6 py-3 text-right text-sm font-medium uppercase">Total unmatched markoffs</th>
        <th scope="col" className="px-6 py-3 text-right text-sm font-medium uppercase">Total unmatched settlements</th>
        <th scope="col" className="px-6 py-3 text-right text-sm font-medium uppercase">Total entries</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {anomalyReports.map((anomalyReport, index) => (
        <tr key={index} className="bg-white text-black">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-left">{anomalyReport.reportFileName}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{anomalyReport.pendingTransactions}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{anomalyReport.missingTransactions}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{anomalyReport.totalUnmatchedSettlements}0</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{anomalyReport.paymentCount + anomalyReport.markoffCount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="mr-5">
                    <button onClick={viewAnomalyReport} className="bg-deepMidnight hover:bg-clearSkiesAhead mr-5 text-white font-bold text-sm py-1 px-2 rounded">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-4">
            <Charts />
          </div>
        </div>
      </div>
    </div>
  );
}
