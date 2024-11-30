using Microsoft.AspNetCore.Components;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class SlidesPanel : ComponentBase
{
    [Parameter]
    public List<Slide> slides { get; set; } = new();

    [Parameter]
    public EventCallback<string> onSlideSelected { get; set; }

    [Parameter]
    public EventCallback onSlideAdded { get; set; }
}
