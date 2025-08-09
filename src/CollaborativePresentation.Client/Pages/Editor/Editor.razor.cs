using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class Editor : ComponentBase
{
    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    [JSInvokable("DoCommand")]
    public static void DoCommand(string command)
    {
        System.Console.WriteLine(command);
    }

    private List<Slide> slides = new();
    private Slide? selectedSlide;
    private List<Element> slideElements = new();
    private List<User> users =
        new()
        {
            new() { Name = "User 1", Role = UserRole.Editor },
        };

    private void SelectSlide(string slideId)
    {
        selectedSlide = slides.FirstOrDefault(s => s.Id == slideId);
        if (selectedSlide != null)
        {
            JSRuntime.InvokeVoidAsync("updateSlideElements", selectedSlide.Elements);
        }
    }

    private void AddSlide()
    {
        slides.Add(
            new Slide { Id = Guid.NewGuid().ToString(), Name = $"Slide {slides.Count + 1}" }
        );
        JSRuntime.InvokeVoidAsync("addSlide");
    }

    private void AddTextBlock()
    {
        JSRuntime.InvokeVoidAsync("addText", selectedSlide.Elements);
    }

    private void AddRectangle()
    {
        JSRuntime.InvokeVoidAsync("addRect", selectedSlide.Elements);
    }

    private void AddCircle()
    {
        JSRuntime.InvokeVoidAsync("addCircle", selectedSlide.Elements);
    }

    private void TogglePresenterMode() { }

    private void ChangeUserRole(User user)
    {
        user.Role = user.Role == UserRole.Editor ? UserRole.Viewer : UserRole.Editor;
    }
}
