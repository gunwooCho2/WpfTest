import React, { useState, useRef, useEffect } from 'react';
import '../styles/main.sass';

// 컴포넌트 임시 import (실제 경로에 맞춰 사용)
import Top from '../components/top';
import Left from '../components/left';
import Right from '../components/right';
import Bottom from '../components/bottom';
import MainView from '../components/mainView';

const Main = () => {
    // --- 사이즈 State 설정 (초기값) ---
    const [dims, setDims] = useState({
        topHeight: 100,
        bottomHeight: 100,
        leftWidth: 200,
        rightWidth: 200
    });

    // --- Min/Max 제약 조건 ---
    const CONSTRAINTS = {
        top: { min: 50, max: 300 },
        bottom: { min: 50, max: 300 },
        left: { min: 100, max: 500 },
        right: { min: 100, max: 500 }
    };

    // 드래그 중인 리사이저를 추적하기 위한 Ref
    const resizingRef = useRef(null);

    // --- 드래그 시작 핸들러 ---
    const startResize = (direction, e) => {
        e.preventDefault();
        resizingRef.current = direction;
        document.body.style.cursor = direction === 'top' || direction === 'bottom' ? 'row-resize' : 'col-resize';

        // 드래그 중 텍스트 선택 방지 등
        document.body.style.userSelect = 'none';

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    // --- 마우스 이동 핸들러 (실제 리사이징 로직) ---
    const handleMouseMove = (e) => {
        if (!resizingRef.current) return;

        setDims((prev) => {
            const newDims = { ...prev };
            const type = resizingRef.current;

            if (type === 'top') {
                let newHeight = e.clientY;
                if (newHeight < CONSTRAINTS.top.min) newHeight = CONSTRAINTS.top.min;
                if (newHeight > CONSTRAINTS.top.max) newHeight = CONSTRAINTS.top.max;
                newDims.topHeight = newHeight;
            }
            else if (type === 'bottom') {
                // 하단은 화면 전체 높이 - 마우스 Y
                let newHeight = window.innerHeight - e.clientY;
                if (newHeight < CONSTRAINTS.bottom.min) newHeight = CONSTRAINTS.bottom.min;
                if (newHeight > CONSTRAINTS.bottom.max) newHeight = CONSTRAINTS.bottom.max;
                newDims.bottomHeight = newHeight;
            }
            else if (type === 'left') {
                let newWidth = e.clientX;
                if (newWidth < CONSTRAINTS.left.min) newWidth = CONSTRAINTS.left.min;
                if (newWidth > CONSTRAINTS.left.max) newWidth = CONSTRAINTS.left.max;
                newDims.leftWidth = newWidth;
            }
            else if (type === 'right') {
                // 우측은 화면 전체 너비 - 마우스 X
                let newWidth = window.innerWidth - e.clientX;
                if (newWidth < CONSTRAINTS.right.min) newWidth = CONSTRAINTS.right.min;
                if (newWidth > CONSTRAINTS.right.max) newWidth = CONSTRAINTS.right.max;
                newDims.rightWidth = newWidth;
            }

            return newDims;
        });
    };

    // --- 드래그 종료 핸들러 ---
    const handleMouseUp = () => {
        resizingRef.current = null;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="main-container">
            {/* Top Panel */}
            <div className="top-panel" style={{ height: dims.topHeight }}>
                <Top />
            </div>
            {/* Top Resizer */}
            <div className="resizer horizontal" onMouseDown={(e) => startResize('top', e)} />

            {/* Middle Area (Left - Center - Right) */}
            <div className="middle-wrapper">

                {/* Left Panel */}
                <div className="left-panel" style={{ width: dims.leftWidth }}>
                    <Left />
                </div>
                {/* Left Resizer */}
                <div className="resizer vertical" onMouseDown={(e) => startResize('left', e)} />

                {/* Main View (Center - WPF Placeholder) */}
                <div className="center-panel">
                    <MainView />
                </div>

                {/* Right Resizer */}
                <div className="resizer vertical" onMouseDown={(e) => startResize('right', e)} />
                {/* Right Panel */}
                <div className="right-panel" style={{ width: dims.rightWidth }}>
                    <Right />
                </div>
            </div>

            {/* Bottom Resizer */}
            <div className="resizer horizontal" onMouseDown={(e) => startResize('bottom', e)} />
            {/* Bottom Panel */}
            <div className="bottom-panel" style={{ height: dims.bottomHeight }}>
                <Bottom />
            </div>
        </div>
    );
};

export default Main;