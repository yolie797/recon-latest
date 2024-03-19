import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "./Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";


export default function ViewAllReport() {
    const [selectedReportBatchIdAndFilename, setSelectedReportBatchIdAndFilename] = useState('');
    const [anomalyReportsLoaded, setAnomalyReportsLoaded] = useState(false);
    const [reportsLimit, setReportsLimit] = useState(200); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedReports, setPaginatedReports] = useState([]); 
    const [selectedRow, setSelectedRow] = useState(null); // To track the selected row
    const navigate = useNavigate();
    const location = useLocation();
    const { anomalyReports } = location.state;

    const handleLimitChange = (e) => {
        setReportsLimit(parseInt(e.target.value));
        setCurrentPage(1); 
    }

    const viewReportDetail = () => {
        if (selectedReportBatchIdAndFilename) {
            const [batchId, reportfilename] = selectedReportBatchIdAndFilename.split(',');
            const paymentFile = anomalyReports[selectedRow].paymentFile;
            const markOffFile = anomalyReports[selectedRow].markoffFile;
            navigate(`/view-reports-detail`, { state: { reportfilename, paymentFile, markOffFile } });
        } else {
            console.log('No report selected');
        }
    }

    useEffect(() => {
        if (anomalyReports && anomalyReports.length > 0) {
            setTotalPages(Math.ceil(anomalyReports.length / reportsLimit));
            const startIndex = (currentPage - 1) * reportsLimit;
            const endIndex = Math.min(startIndex + reportsLimit, anomalyReports.length);
            setPaginatedReports(anomalyReports.slice(startIndex, endIndex));

            setAnomalyReportsLoaded(true);
        }
    }, [anomalyReports, currentPage, reportsLimit]);

    const handlePageChange = (increment) => {
        const newPage = currentPage + increment;
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }

    const handleRowClick = (index, report) => {
        setSelectedRow(index);
        setSelectedReportBatchIdAndFilename(`${report.batchId},${report.reportFileName}`);
    };

    const handleRowDoubleClick = (report) => {
        viewReportDetail(report);
    };

    return (
        <div className="flex h-screen text-white">
            <Sidebar />
            <div className="w-full bg-gray-100">
                <nav className="bg-deepMidnight">
                    <div className="mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex p-5 font-semibold text-lg">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-shrink-0 text-white mr-6 ">
                                    <FaArrowLeft className="h-5 w-6" />
                                </button>
                                Recon Reports
                            </div>
                        </div>
                    </div>
                </nav>
                
                <div className="w-full">
                    <div className="bg-white border border-deepMidnight shadow-md p-4 rounded-md m-4 ">
                        <div className="flex flex-col text-gray-950">
                            <h3 className="text-2xl text-deepMidnight font-bold mb-4 ml-5 mt-5">Limit: <input type="number" value={reportsLimit} max={500} onChange={handleLimitChange} /></h3>
                        </div>

                        <div className="flex justify-end mb-2 mr-1">
                            <button className="bg-deepMidnight hover:bg-clearSkiesAhead text-white font-bold py-2 px-3 rounded text-sm mr-5" onClick={viewReportDetail}>View</button>
                        </div>

                        <div className="p-4 ">
                        <div className="overflow-hidden border-b border-gray-200 shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200 font-mono">
        <thead>
            <tr className="bg-deepMidnight border-gray-300">
                <th className="px-4 py-2 text-left">Anomaly report file name</th>
                <th className="px-4 text-right">Total unmatched payments</th>
                <th className="px-4 py-2 text-right">Total unmatched markoffs</th>
                <th className="px-4 py-2 text-right">Total unmatched settlements</th>
                <th className="px-4 py-2 text-right">Total entries</th>
            </tr>
        </thead>
        <tbody>
            {anomalyReportsLoaded && paginatedReports.map((report, index) => (
                <tr key={index} className={`border divide-gray-300 hover:bg-gray-200 cursor-pointer text-gray-700 transition duration-200 ${selectedRow === index ? 'bg-gray-300' : ''}`} onClick={() => handleRowClick(index, report)} onDoubleClick={() => handleRowDoubleClick(report)}>
                    <td className="px-6 py-4 whitespace-nowrap text-left">{report.reportFileName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{report.pendingTransactions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{report.missingTransactions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{report.totalUnmatchedSettlements}0</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{report.paymentCount + report.markoffCount}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


                            <div className="col-span-12 flex justify-end items-center mt-4">
                                <button className="text-gray-400 hover:text-gray-700" onClick={() => handlePageChange(-1)}>
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
