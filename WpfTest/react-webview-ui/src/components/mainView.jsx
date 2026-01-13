import React from 'react';
import '../styles/mainView.sass';

// 이 컴포넌트는 가운데 위치하며, 실제로는 투명하게 처리되어
// 뒤에 있는 WPF Native Control이 보이도록 유도하거나,
// React 상에서 WPF와 상호작용하는 레이어로 사용됩니다.
const MainView = () => {
    return (
        <div className="main-view-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* 
               WPF Popup과 위치를 맞추기 위한 빈 공간일 수도 있고,
               WPF 위에 띄울 React 오버레이 UI가 들어갈 수도 있습니다.
            */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '10px',
                color: 'rgba(0, 0, 0, 0)',
                pointerEvents: 'none' // 클릭 이벤트를 WPF로 통과시키고 싶다면 사용
            }}>
                Main View Area (React)
            </div>
        </div>
    );
};

export default MainView;