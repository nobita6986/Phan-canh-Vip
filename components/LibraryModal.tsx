
import React, { useEffect, useState } from 'react';
import type { SavedSession, TableRowData } from '@/src/types';
import { exportCleanScriptToTxt, exportImagePromptsToExcel, exportVideoPromptsToExcel, convertSavedSessionToTableData } from '@/utils/fileUtils';
import { ToastType } from './Toast';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: SavedSession) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, onLoadSession, showToast }) => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = () => {
    try {
      const stored = localStorage.getItem('studyo_sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sắp xếp mới nhất lên đầu
        setSessions(parsed.sort((a: SavedSession, b: SavedSession) => b.timestamp - a.timestamp));
      }
    } catch (e) {
      console.error("Failed to load sessions", e);
    }
  };

  const deleteSession = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiên làm việc này? Hành động này không thể hoàn tác.')) {
      const newSessions = sessions.filter(s => s.id !== id);
      setSessions(newSessions);
      localStorage.setItem('studyo_sessions', JSON.stringify(newSessions));
      showToast('Đã xóa phiên làm việc.', 'info');
    }
  };

  const handleDownloadScript = (session: SavedSession) => {
    const tableData = convertSavedSessionToTableData(session.rows);
    if (exportCleanScriptToTxt(tableData, `${session.name}_Script.txt`)) {
        showToast('Đã tải xuống kịch bản.', 'success');
    } else {
        showToast('Kịch bản trống.', 'warning');
    }
  };

  const handleDownloadImagePrompts = (session: SavedSession) => {
    const tableData = convertSavedSessionToTableData(session.rows);
    if (exportImagePromptsToExcel(tableData, `${session.name}_ImagePrompts.xlsx`)) {
        showToast('Đã tải xuống Prompt Ảnh.', 'success');
    } else {
        showToast('Không có Prompt Ảnh.', 'warning');
    }
  };

  const handleDownloadVideoPrompts = (session: SavedSession) => {
    const tableData = convertSavedSessionToTableData(session.rows);
    if (exportVideoPromptsToExcel(tableData, `${session.name}_VideoPrompts.xlsx`)) {
        showToast('Đã tải xuống Prompt Video.', 'success');
    } else {
        showToast('Không có Prompt Video.', 'warning');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#0b2b1e] border border-gray-200 dark:border-[#1f4d3a] p-8 rounded-xl space-y-6 w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thư viện Phiên làm việc</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tự động lưu lại kịch bản và prompt của bạn.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-3xl">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
          {sessions.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p>Chưa có phiên làm việc nào được lưu.</p>
              <p className="text-xs mt-2">Hệ thống sẽ tự động lưu khi bạn tải kịch bản hoặc tạo prompt.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-gray-50 dark:bg-[#020a06] border border-gray-200 dark:border-[#1f4d3a] rounded-xl p-5 hover:border-green-400 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                        {session.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.timestamp).toLocaleString('vi-VN')} • {session.rows.length} phân cảnh
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => deleteSession(session.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <button 
                        onClick={() => handleDownloadScript(session)}
                        className="text-xs font-semibold py-2 px-3 rounded-lg bg-white dark:bg-[#0f3a29] border border-gray-300 dark:border-green-800 text-gray-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    >
                        📄 Tải Kịch bản (.txt)
                    </button>
                    <button 
                        onClick={() => handleDownloadImagePrompts(session)}
                        className="text-xs font-semibold py-2 px-3 rounded-lg bg-white dark:bg-[#0f3a29] border border-gray-300 dark:border-green-800 text-gray-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    >
                        🖼️ Tải Prompt Ảnh (.xlsx)
                    </button>
                    <button 
                        onClick={() => handleDownloadVideoPrompts(session)}
                        className="text-xs font-semibold py-2 px-3 rounded-lg bg-white dark:bg-[#0f3a29] border border-gray-300 dark:border-green-800 text-gray-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    >
                        🎬 Tải Prompt Video (.xlsx)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
