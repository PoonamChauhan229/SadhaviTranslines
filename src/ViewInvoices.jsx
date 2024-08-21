import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { url } from './utils/constants';
import { json, useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { GiDistraction } from "react-icons/gi";
import fileDownload from 'react-file-download';
import * as XLSX from 'xlsx';


const ViewInvoices = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [newfilteredInvoices,setNewFilteredInvoices]=useState([])

    const [client, setClient] = useState('');
    const [status, setStatus] = useState(''); // paid or unpaid
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    


    useEffect(() => {
        invoicesData();
    }, []);

    const invoicesData = async () => {
        const res = await axios.get(`${url}/viewinvoices`);
        console.log(res.data);
        setInvoices(res.data);
        setNewFilteredInvoices(res.data)
      
    };


    const downloadInvoice = async (_id,fileName) => {
        console.log(fileName)
        try {
            const res = await axios.get(`${url}/download/${_id}`, {
                responseType: 'blob' // Important for handling binary data
            });
    
            
            let file = fileName; // Default filename    
              
            // Download the file using react-file-download
            fileDownload(res.data, file);
        } catch (error) {
            console.error('Error downloading invoice:', error.response?.data?.message || error.message);
            alert('Error downloading invoice. Please check the console for more details.');
        }
    };
      
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(newfilteredInvoices.map((invoice, index) => ({
            'Sr.No': index + 1,
            'Bill No': invoice.bill_no,
            'LR Date': new Date(invoice.date_lr).toLocaleDateString('en-US'),
            'LR NO': invoice.lr_no,
            'Vehicle No': invoice.vehicle_no,
            'Weight': invoice.weight,
            'Rate': invoice.rate,
            'Freight': invoice.freight_amount,
            'IGST Amount (5%)': invoice.igst_amount,
            'LR Charges': invoice.lr_charges,
            'Total Amount': invoice.total_amount,
            'Address': invoice.address,
            'Description of Goods': invoice.description_of_goods,
            'From': invoice.from,
            'To': invoice.to,
        })));
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    
        // Generate the Excel file and trigger the download
        XLSX.writeFile(workbook, 'invoices.xlsx');
    };
    const applyFilters = (e) => {
        console.log("Form submitted",e)
        e.preventDefault();
    
      
        console.log(client)
    
        if (client) {
            let filteredInvoices = invoices.filter(invoice => invoice.address.toLowerCase().includes(client.toLowerCase()));
            console.log(filteredInvoices)
            setNewFilteredInvoices(filteredInvoices)
        }
    
        if (status) {
           let filteredInvoices = invoices.filter(invoice => invoice.status === status);
            setNewFilteredInvoices(filteredInvoices)
        }
    
        if (fromDate) {
           let filteredInvoices = invoices.filter(invoice => new Date(invoice.date_lr) >= new Date(fromDate));
            setNewFilteredInvoices(filteredInvoices)
        }
    
        if (toDate) {
            let filteredInvoices = invoices.filter(invoice => new Date(invoice.date_lr) <= new Date(toDate));
            setNewFilteredInvoices(filteredInvoices)
        }
    
        // setNewFilteredInvoices(filteredInvoices);
    };
    
    return (
      <>
     <div className='absolute top-10 left-[19%] right-0 px-4'>
        <div className="container mx-auto p-4">
            <div className="shadow-lg rounded-lg overflow-hidden">
                {/* View All Invoices Header Section */}
                <div className="py-1 px-4 flex justify-between bg-gray-100">
                <div className="text-lg font-bold text-blue-600 py-1 flex">
                    <div className='mx-2 my-2'><FaDownload onClick={()=>exportToExcel()}/></div>
                    <div>View All Invoices</div>
                </div>
                    <button
                        className="btn btn-primary inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                        type="button"
                        onClick={() => navigate('/createinvoices')}
                    >                     
                        <span className="mr-1">Add Invoice</span>
                        <span className='pt-1'><FaArrowRight/></span>
                     
                    </button>
                </div>

                {/* Filter Section */}

                <div className="my-4">
                    <form onSubmit={applyFilters} className="flex flex-wrap gap-4">
                        <input 
                            type="text" 
                            placeholder="Client" 
                            value={client} 
                            onChange={(e) => setClient(e.target.value)} 
                            className="border rounded px-3 py-2"
                        />
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Select Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                        <input 
                            type="date" 
                            value={fromDate} 
                            onChange={(e) => setFromDate(e.target.value)} 
                            className="border rounded px-3 py-2"
                        />
                        <input 
                            type="date" 
                            value={toDate} 
                            onChange={(e) => setToDate(e.target.value)} 
                            className="border rounded px-3 py-2"
                        />
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                    </form>
                </div>


                {/* Table Section -Invoices */}
                <div className="mt-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 border-b text-sm "><GiDistraction/></th>
                                    <th className="py-2 px-4 border-b text-sm">Sr.No</th>
                                    <th className="py-2 px-4 border-b text-sm">Bill No</th>
                                    <th className="py-2 px-4 border-b text-sm">LR Date</th>
                                    <th className="py-2 px-4 border-b text-sm">LR NO</th>
                                    <th className="py-2 px-4 border-b text-sm w-100">Vehicle No</th>
                                    <th className="py-2 px-4 border-b text-sm">Weight</th>
                                    <th className="py-2 px-4 border-b text-sm">Rate</th>
                                    <th className="py-2 px-4 border-b text-sm">Freight</th>
                                    <th className="py-2 px-4 border-b text-sm">IGST Amount (5%)</th>
                                    <th className="py-2 px-4 border-b text-sm">LR Charges</th>
                                    <th className="py-2 px-4 border-b text-sm">Total Amount</th>
                                    <th className="py-2 px-4 border-b text-sm">Address</th>
                                    <th className="py-2 px-4 border-b text-sm">Description of Goods</th>
                                    <th className="py-2 px-4 border-b text-sm">From</th>
                                    <th className="py-2 px-4 border-b text-sm">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newfilteredInvoices.map((element, index) => {
                                    const { _id, vehicle_no, address, bill_no, date_lr, description_of_goods, freight_amount, from, to, igst_amount, lr_charges, lr_no, rate, total_amount, weight,fileName } = element;
                                    const LRDate = new Date(date_lr);
                                    const formattedLRDate = LRDate.toLocaleDateString('en-US');

                                    return (
                                        <tr key={_id} className="border-b">
                                            <td className='py-2 px-4'>
                                                <FaDownload onClick={()=>downloadInvoice(_id,fileName)}/><MdEdit/><MdDeleteForever/></td>
                                            <td className="py-2 px-4">{index + 1}</td>
                                            <td className="py-2 px-4">{bill_no}</td>
                                            <td className="py-2 px-4">{formattedLRDate}</td>
                                            <td className="py-2 px-4">{lr_no}</td>
                                            <td className="py-2 px-4">{vehicle_no}</td>
                                            <td className="py-2 px-4">{weight}</td>
                                            <td className="py-2 px-4">{rate}</td>
                                            <td className="py-2 px-4">{freight_amount}</td>
                                            <td className="py-2 px-4">{igst_amount}</td>
                                            <td className="py-2 px-4">{lr_charges}</td>
                                            <td className="py-2 px-4">{total_amount}</td>
                                            <td className="py-2 px-4">{address.substring(0,9)}</td>
                                            <td className="py-2 px-4">{description_of_goods}</td>
                                            <td className="py-2 px-4">{from}</td>
                                            <td className="py-2 px-4">{to}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>                          
        </>
    );
};

export default ViewInvoices;
