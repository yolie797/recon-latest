import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


export default function ViewReportDetail() {
  const location = useLocation();
  const [selectedReportTab, setSelectedReportTab] = useState('Payment Unreconciled'); // Default selected tab
  const [reportTabs, setReportTabs] = useState([]);
  const [reportTabsContent, setReportTabsContent] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadedFile, setDownloadedFile] = useState(false);

  const { reportfilename, paymentFile, markOffFile } = location.state;

  useEffect(() => {
    fetchData();
  }, [selectedReportTab, currentPage]);

  async function fetchData() {
    try {
      // Simulate fetching report tabs
      const tabs = ["Payment Unreconciled", "Markoff Missing"];
      setReportTabs(tabs);

      // Fetch report content
      let response;
      let data;
      if (selectedReportTab === "Payment Unreconciled") {
        response = await axios.get(`http://localhost:8080/recon/unreconciledTransactions?fileName=${paymentFile}&fileType=payment`);
      } else if (selectedReportTab === "Markoff Missing") {
        response = await axios.get(`http://localhost:8080/recon/unreconciledTransactions?fileName=${markOffFile}&fileType=markoff`);
      }
      data = response.data;
      const totalPagesCount = Math.ceil(data.length / 10);
      setTotalPages(totalPagesCount);
      setReportTabsContent(data.slice((currentPage - 1) * 10, currentPage * 10));
    } catch (error) {
      console.error("Error fetching report content:", error);
    }
  }

  const handleDataSelection = (selectedData) => {
    setSelectedData(selectedData);
  };

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const downloadReport = () => {
    toast.info('Downloading file...');
    if (reportfilename) {
      axios.get(`http://localhost:8080/recon/downloadAnomalyReport?fileName=${reportfilename}`)
        .then(() => {
          setDownloadedFile(true);
          toast.success('File downloaded successfully');
        })
        .catch(error => {
          console.error("Error downloading report:", error);
          toast.error('Error downloading report');
        });
    }
  };

  return (
    <div className="flex h-screen text-gray-700">
      <Sidebar />
      <div className="w-full">
        <nav className="bg-deepMidnight">
          <div className="mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center text-white font-semibold text-lg">
                <button onClick={() => window.history.back()} className="flex-shrink-0 text-white mr-6">
                  <FaArrowLeft className="h-5 w-6"/>
                </button>
                Recon Report
              </div>
            </div>
          </div>
        </nav>

        <div className="mx-auto bg-white rounded-lg shadow-md border border-deepMidnight ml-5 mb-5 mr-5 mt-6">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-deepMidnight font-semibold text-xl ml-5">Recon Report: {reportfilename}</h2>
              <p className="text-sm text-deepMidnight ml-5 mt-2">Payment File: {paymentFile}</p>
              <p className="text-sm text-deepMidnight ml-5">Markoff File: {markOffFile}</p>
            </div>
            
          </div>

          <div className="mt-4 ml-5 flex items-center justify-between">
          <div className='flex justify-center ml-2'>
    <ul className="flex rounded-lg overflow-hidden text-lg ml-3 bg-gray-200">
        <li className="flex-1">
            <button
                className={`flex items-center justify-center px-6 py-3 text-center cursor-pointer focus:outline-none ${
                    selectedReportTab === 'Payment Unreconciled' ? 'bg-deepMidnight text-white border-b-2 ' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedReportTab('Payment Unreconciled')}
            >
                Payment Unreconciled
            </button>
        </li>
        <li className="ml-1">
            <button
                className={`flex items-center justify-center px-6 py-3 text-center cursor-pointer focus:outline-none ${
                    selectedReportTab === 'Markoff Missing' ? 'bg-deepMidnight text-white border-b-2 ' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedReportTab('Markoff Missing')}
            >
                Markoff Missing
            </button>
        </li>
    </ul>
</div>


    <button className="bg-deepMidnight hover:bg-clearSkiesAhead mr-5 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={downloadReport}>
        Download
    </button>
</div>


          <div className="p-3 mb-2">
          <div className="overflow-hidden border-b border-gray-200 shadow rounded-lg">
            {selectedReportTab && (
              <table className="min-w-full divide-y divide-gray-200 font-mono">
                <thead>
                  <tr className="bg-deepMidnight text-white">
                    <th className="px-4 py-2 text-left">Institution</th>
                    <th className="px-4 py-2 text-left">Reference Number</th>
                    <th className="px-4 py-2 text-right">Transaction Amount</th>
                    <th className="px-4 py-2 text-left">Transaction Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportTabsContent.map((detail, index) => (
                    <tr key={index} className="border divide-gray-200 cursor-pointer" onClick={() => handleDataSelection(detail)}>
                      <td className="px-6 py-4 whitespace-nowrap">{detail.institution}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{detail.transactionReference}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">{(detail.transactionAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{detail.transactionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end mt-2 p-2 space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-clearSkiesAhead hover:bg-deepMidnight text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Prev
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-deepMidnight hover:bg-clearSkiesAhead text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>

  );
}
