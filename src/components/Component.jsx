import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";


function Component() {
  const [selectedOption, setSelectedOption] = useState('payment');
  const [fileReports, setFileReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const navigate = useNavigate();

  const handleOptionChange = async (option) => {
    setSelectedOption(option);
    setCurrentPage(1);
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/recon/fileReport?fileType=${option}`);
      setFileReports(response.data);
    } catch (error) {
      console.error('Error fetching file reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewFileDetails = () => {
    if (!selectedData) return;
    const { fileName } = selectedData;
    navigate('/view-file-details', { state: { selectedOption, fileName } });
  };

  useEffect(() => {
    const fetchInitialFileReports = async () => {
      await handleOptionChange(selectedOption);
    };
    fetchInitialFileReports();
  }, [selectedOption]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fileReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  const handleDataSelection = (fileReport) => {
    setSelectedData(fileReport);
    setSelectedRow(fileReport);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full bg-gray-100">
                <nav className="bg-deepMidnight">
                    <div className="mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex p-5 font-semibold text-lg text-white">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-shrink-0 text-white mr-6 ">
                                    <FaArrowLeft className="h-5 w-6" />
                                </button>
                                File Reports
                            </div>
                        </div>
                    </div>
                </nav>
      <div className="w-full">
      <div className="bg-white border border-deepMidnight shadow-md p-4 rounded-md m-4 ">

      <div className="flex justify-between px-5 py-1 mr-5">
      <ul className="flex rounded-lg overflow-hidden text-lg mr-3 border border-gray-300">
    {['payment', 'markoff', 'settlement'].map((option, index) => (
      <li key={index} className="flex-1">
        <input
          type="radio"
          value={option}
          name="tab-option"
          id={option}
          className="hidden"
          checked={selectedOption === option}
          onChange={() => handleOptionChange(option)}
        />
        <label
          htmlFor={option}
          className={`flex items-center justify-center px-6 py-3 text-center cursor-pointer ${
            selectedOption === option ? 'bg-white border-b-2 border-gray-300' : 'bg-gray-100'
          }`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </label>
      </li>
    ))}
  </ul>
  <div>
    <button className="bg-deepMidnight hover:bg-clearSkiesAhead text-white font-semibold px-4 py-2 ml-5 mt-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={viewFileDetails}>
      View
    </button>
  </div>
</div>

        <div className="overflow-x-auto mb-4">
        <div className="overflow-hidden border-b border-gray-200 shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200 font-mono">
        <thead className="bg-deepMidnight text-white">
            <tr>
                {['Date and Time', 'File Name', 'Institution', 'Total Records', 'Valid Records', 'Invalid Records'].map((header, index) => (
                    <th key={index} scope="col" className={`px-6 py-3 ${index < 3 ? 'text-left' : 'text-right'} text-xs font-medium uppercase tracking-wider`}>
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((fileReport, index) => (
                <tr key={index}
                    className={`${selectedRow === fileReport ? 'bg-gray-200' : ''} hover:bg-gray-200`}
                    onClick={() => handleDataSelection(fileReport)}
                    onDoubleClick={() => viewFileDetails()}>
                    <td className="px-6 py-4 whitespace-nowrap text-left">{fileReport.uploadDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">{fileReport.fileName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">{fileReport.institution}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{fileReport.totalRecords}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{fileReport.validRecords}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{fileReport.invalidRecords}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


        </div>

        <div className="col-span-12 flex justify-center items-center mt-4">
          {fileReports.length > itemsPerPage && (
            <ul className="flex">
              {[...Array(Math.ceil(fileReports.length / itemsPerPage))].map((_, index) => (
                <li key={index}>
                  <button
                    className={`text-gray-400 hover:text-gray-700 ${
                      currentPage === index + 1 ? 'font-bold' : ''
                    }`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Component;
