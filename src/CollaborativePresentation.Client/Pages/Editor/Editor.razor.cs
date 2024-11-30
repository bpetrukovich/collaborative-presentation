using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class Editor : ComponentBase
{
    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    private List<Slide> slides =
        new()
        {
            new Slide { Id = Guid.NewGuid().ToString(), Name = "Slide 1" },
        };
    private Slide selectedSlide;
    private List<Element> slideElements = new();
    private List<User> users =
        new()
        {
            new() { Name = "User 1", Role = UserRole.Editor },
        };

    protected override void OnInitialized()
    {
        selectedSlide = slides.FirstOrDefault();
    }

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
    }

    private void AddTextBlock() { }

    private void AddRectangle()
    {
        if (selectedSlide == null)
            return;

        var newElement = new SlideElement
        {
            Type = "rectangle",
            X = 100,
            Y = 100,
        };
        selectedSlide.Elements.Add(newElement);

        JSRuntime.InvokeVoidAsync("updateSlideElements", selectedSlide.Elements);
    }

    private void AddCircle() { }

    private void TogglePresenterMode() { }

    private void ChangeUserRole(User user)
    {
        user.Role = user.Role == UserRole.Editor ? UserRole.Viewer : UserRole.Editor;
    }
}
