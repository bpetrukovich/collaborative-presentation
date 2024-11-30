using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class SlideEditor : ComponentBase
{
    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    private bool isKonvaInitialized;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && !isKonvaInitialized)
        {
            isKonvaInitialized = true;
            await JSRuntime.InvokeVoidAsync("initializeKonva");
        }
    }
}
