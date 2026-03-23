"use client";
import React from 'react';

export const RequestExchangeModal = ({ currentUser, targetUser, onClose }: any) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 text-center">
        <h3 className="text-xl font-bold mb-4">Request Skill Exchange</h3>
        <p className="mb-6">Send a request to {targetUser.name} to exchange skills.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
          <button onClick={() => { alert('Request sent!'); onClose(); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Send Request</button>
        </div>
      </div>
    </div>
  );
};
