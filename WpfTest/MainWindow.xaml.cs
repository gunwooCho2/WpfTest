using System;
using System.IO;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media.Imaging;
using Microsoft.Web.WebView2.Core;

namespace WpfTest
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            Loaded += async (s, e) =>
            {
                await InitializeWebViewAsync();
                await LoadImage("WpfTest/Resources/test.png");
            };
        }

        private async Task InitializeWebViewAsync()
        {
            await WebUi.EnsureCoreWebView2Async();

#if DEBUG
            WebUi.Source = new Uri("http://localhost:5173");
#else
                string uiFolderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "react-webview-ui");

                if (Directory.Exists(uiFolderPath))
                {
                    WebUi.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "app.local", 
                        uiFolderPath, 
                        CoreWebView2HostResourceAccessKind.Allow
                    );
                    WebUi.Source = new Uri("https://app.local/index.html");
                }
                else
                {
                    MessageBox.Show("UI 폴더를 찾을 수 없어. 빌드 출력 설정을 확인해봐.");
                }
#endif
        }

        private async Task LoadImage(string imagePath)
        {
            System.Windows.Media.ImageSource source;

            if (File.Exists(imagePath))
            {
                var bitmap = new BitmapImage();
                bitmap.BeginInit();
                bitmap.UriSource = new Uri(imagePath);
                // 성능 팁: 이미지를 완전히 메모리에 로드한 후 파일을 해제함
                bitmap.CacheOption = BitmapCacheOption.OnLoad;
                bitmap.EndInit();
                source = bitmap;
            }
            else
            {
                MessageBox.Show($"이미지 경로를 찾을 수 없습니다:\n{imagePath}\n\n기본 검은색 이미지를 표시합니다.",
                    "이미지 로드 실패",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);

                // 1x1 검은색 비트맵 생성 (PixelFormats.BlackWhite에서 0은 검은색)
                source = BitmapSource.Create(
                    1, 1,
                    96, 96,
                    System.Windows.Media.PixelFormats.BlackWhite,
                    null,
                    new byte[] { 0 },
                    1
                );
            }

            // 2. 컨트롤에 주입
            NativeImageRenderer.Source = source;

            // 3. ZoomAndPan 정렬 (너가 원한 기능)
            // 소스를 넣자마자 호출하면 이미지가 아직 렌더링 전이라 크기 계산이 안 될 수 있어.
        }
    }
}