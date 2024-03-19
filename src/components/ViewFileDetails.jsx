import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ViewFileDetails() {
    const [fileDetails, setFileDetails] = useState([]);
    const { fileName, selectedOption } = useLocation().state;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [downloadedFile, setDownloadedFile] = useState(false);
    const [tab, setTab] = useState("valid"); // default tab is valid transactions

    useEffect(() => {
        fetchData();
    }, [fileName, selectedOption, currentPage, tab]);

    const fetchData = async () => {
        try {
            let endpoint = tab === 'valid' ? 'validTransactions' : 'invalidTransactions';
            const response = await axios.get(`http://localhost:8080/recon/${endpoint}?fileName=${fileName}&fileType=${selectedOption}`);
            const data = response.data;
            const totalPagesCount = Math.ceil(data.length / 11);
            setTotalPages(totalPagesCount);
            setFileDetails(data.slice((currentPage - 1) * 11, currentPage * 11));
        } catch (error) {
            console.error('Error fetching file details:', error);
        }
    };

    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const downloadReport = () => {
        toast.info('Downloading file...');
        if (fileName) {
            const response = axios.get(`http://localhost:8080/recon/downloadFileReport?fileName=${fileName}`);
            setDownloadedFile(true);
            toast.success('File downloaded successfully');
            console.log(response);
        }
    };

    const handleTabChange = (tabName) => {
        setTab(tabName);
        setCurrentPage(1); // reset page when switching tabs
    };

    return (
        <div className="flex h-screen ">
            <Sidebar />
            <div className="w-full bg-gray-100">
                <nav className="bg-deepMidnight">
                    <div className="mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex p-5">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-shrink-0 text-white mr-6"
                                >
                                    <FaArrowLeft className="h-5 w-6" />
                                </button>
                                <label className="text-white font-semibold">{selectedOption} File</label>
                            </div>
                        </div>
                    </div>
                </nav>
                <div>
                    <div className="col-sm-12 mt-6 rounded-lg border border-deepMidnight ml-5 mb-5 mr-5">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="px-4 py-2 border-b ">
                                <div className="flex items-center ml-6">
                                    <div className="flex-1">
                                        <h5 className="text-lg font-bold text-deepMidnight">Transactions for {fileName}</h5>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                <div className='flex justify-center ml-2'>
<ul className="flex rounded-lg overflow-hidden text-lg ml-3 border border-gray-300">
<li className="flex-1">
<input
                type="radio"
                value="valid"
                name="tab"
                id="valid"
                className="hidden"
                checked={tab === 'valid'}
                onChange={() => handleTabChange('valid')}
            />
<label
                htmlFor="valid"
                className={`flex items-center justify-center px-20 py-3 text-center cursor-pointer ${
                    tab === 'valid' ? 'bg-white border-b-2 border-gray-300' : 'bg-gray-100'
                }`}
>
                Valid Transactions
</label>
</li>
<li className="ml-1">
<input
                type="radio"
                value="invalid"
                name="tab"
                id="invalid"
                className="hidden"
                checked={tab === 'invalid'}
                onChange={() => handleTabChange('invalid')}
            />
<label
                htmlFor="invalid"
                className={`flex items-center justify-center px-20 py-3 text-center cursor-pointer ${
                    tab === 'invalid' ? 'bg-white border-b-2 border-gray-300' : 'bg-gray-100'
                }`}
>
                Invalid Transactions
</label>
</li>
</ul>
</div>


    <button className="bg-deepMidnight hover:bg-clearSkiesAhead mr-5 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={downloadReport}>
        Download
    </button>
</div>

<div className="p-4 ">
<div className="overflow-hidden border-b border-gray-200 shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200 font-mono">
        <thead className="bg-deepMidnight text-white">
            <tr>
                <th className="px-4 py-2 text-left">Institution</th>
                <th className="px-4 py-2 text-left">Reference Number</th>
                <th className="px-2 py-2 text-right">Transaction Amount</th>
                <th className="px-4 py-2 text-left">Transaction Date</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {fileDetails.length > 0 && fileDetails.map((transaction, index) => (
                <tr key={index} className=" divide-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.institution}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">{transaction.transactionReference || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{transaction.transactionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">{transaction.transactionDate}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


                            <div className="flex justify-end p-2 mt-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className="bg-clearSkiesAhead hover:bg-deepMidnight text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ml-5"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className="bg-deepMidnight hover:bg-clearSkiesAhead text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ml-5"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
        </div>
        </div>
    );
}
