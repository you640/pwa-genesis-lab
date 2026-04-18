import React, { useState } from 'react';

interface PrestaShopApiTesterProps {
  onClose: () => void;
}

type TestStatus = 'pending' | 'success' | 'failure' | 'error';

interface TestResult {
  name: string;
  path: string;
  status: TestStatus;
  httpCode?: number;
  responseText?: string;
}

export const PrestaShopApiTester: React.FC<PrestaShopApiTesterProps> = ({ onClose }) => {
  const [prestaUrl, setPrestaUrl] = useState('https://shop.pop-mart.cloud');
  const [prestaKey, setPrestaKey] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testsToRun = [
    { name: 'Check API Root', path: '/api/' },
    { name: 'List Products (First 5)', path: '/api/products?display=[id,name,price]&limit=0,5' },
    { name: 'Check Stock (First 5)', path: '/api/stock_availables?display=[id,id_product,quantity]&limit=0,5' },
  ];

  const runTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];

    for (const test of testsToRun) {
      const currentTestResult: TestResult = { name: test.name, path: test.path, status: 'pending' };
      results.push(currentTestResult);
      setTestResults([...results]);

      try {
        const response = await fetch(`${prestaUrl.replace(/\/$/, '')}${test.path}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${prestaKey}:`),
          },
        });

        currentTestResult.httpCode = response.status;
        const text = await response.text();
        currentTestResult.responseText = text.substring(0, 500) + (text.length > 500 ? '...' : '');

        if (response.ok) {
          currentTestResult.status = 'success';
        } else {
          currentTestResult.status = 'failure';
        }
      } catch (error) {
        currentTestResult.status = 'error';
        currentTestResult.responseText = error instanceof Error ? error.message : 'An unknown network error occurred.';
      }
      setTestResults([...results]);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failure': return 'text-red-400';
      case 'error': return 'text-orange-400';
      default: return 'text-slate-500';
    }
  };
  
  const getStatusBgColor = (status: TestStatus) => {
    switch (status) {
      case 'success': return 'bg-green-500/10';
      case 'failure': return 'bg-red-500/10';
      case 'error': return 'bg-orange-500/10';
      default: return 'bg-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="font-teko text-3xl text-lime-400 uppercase">PrestaShop API Tester</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close API tester">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 p-4 rounded-lg mb-6">
                <h3 className="font-bold">Security Warning</h3>
                <p className="text-sm mt-1">This tool is for development and testing purposes ONLY. Never expose your API key in a production frontend application. For production use, API calls must be proxied through a secure backend server.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="prestaUrl" className="block text-sm font-medium text-slate-300">PrestaShop URL</label>
                    <input type="text" id="prestaUrl" value={prestaUrl} onChange={(e) => setPrestaUrl(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-lime-500 focus:border-lime-500"/>
                </div>
                <div>
                    <label htmlFor="prestaKey" className="block text-sm font-medium text-slate-300">PrestaShop Webservice Key</label>
                    <input type="password" id="prestaKey" value={prestaKey} onChange={(e) => setPrestaKey(e.target.value)} className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-lime-500 focus:border-lime-500"/>
                </div>
            </div>
            
            <button onClick={runTests} disabled={isLoading || !prestaKey || !prestaUrl} className="mt-6 w-full bg-lime-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-lime-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading && <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-2"></div>}
                {isLoading ? 'Testing...' : 'Run Tests'}
            </button>
            
            {testResults.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-teko text-2xl text-slate-200">Test Results</h3>
                    <div className="space-y-4 mt-4">
                        {testResults.map((result, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${getStatusBgColor(result.status)} border-slate-700`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-slate-100">{result.name}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBgColor(result.status)} ${getStatusColor(result.status)} border border-current`}>
                                        {result.status.toUpperCase()} {result.httpCode && `(${result.httpCode})`}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 mt-1">GET {result.path}</p>
                                {result.responseText && (
                                    <pre className="mt-3 bg-black/50 p-3 rounded-md text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-40">{result.responseText}</pre>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
      `}</style>
      </div>
    </div>
  );
};
