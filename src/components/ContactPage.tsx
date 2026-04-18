import React from 'react';

export const ContactPage: React.FC = () => {
    return (
        <main className="bg-[#0c0c0c] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400">
                        Contact Headquarters
                    </h1>
                    <p className="mt-2 text-lg text-slate-400">Have questions? We have answers. Reach out to the Forge team.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Contact Form */}
                    <div className="p-8 md:p-12">
                        <h2 className="font-teko text-4xl text-white">Send a Transmission</h2>
                        <form action="#" method="POST" className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-slate-300">First name</label>
                                <div className="mt-1">
                                    <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="py-3 px-4 block w-full shadow-sm bg-slate-800 border-slate-700 rounded-md focus:ring-lime-500 focus:border-lime-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-slate-300">Last name</label>
                                <div className="mt-1">
                                    <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="py-3 px-4 block w-full shadow-sm bg-slate-800 border-slate-700 rounded-md focus:ring-lime-500 focus:border-lime-500" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email" className="py-3 px-4 block w-full shadow-sm bg-slate-800 border-slate-700 rounded-md focus:ring-lime-500 focus:border-lime-500" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
                                <div className="mt-1">
                                    <textarea id="message" name="message" rows={4} className="py-3 px-4 block w-full shadow-sm bg-slate-800 border-slate-700 rounded-md focus:ring-lime-500 focus:border-lime-500"></textarea>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <button type="submit" className="btn-3d primary w-full text-base px-6 py-3">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="relative bg-black">
                         <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2953&auto=format&fit=crop')"}}></div>
                         <div className="relative p-8 md:p-12 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="font-teko text-4xl text-white">Our Coordinates</h2>
                                <div className="mt-6 space-y-4 text-slate-300">
                                    <p className="flex items-start">
                                        <svg className="flex-shrink-0 h-6 w-6 text-lime-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                        <span>13 Iron Paradise Ave,<br/>Gainsville, TX 76240</span>
                                    </p>
                                    <p className="flex items-center">
                                         <svg className="flex-shrink-0 h-6 w-6 text-lime-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                        <span>support@theforge.com</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 h-48 w-full bg-slate-800 rounded-lg border border-slate-700 text-slate-500 flex items-center justify-center">
                                Map Placeholder
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
