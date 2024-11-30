using Microsoft.AspNetCore.Components;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class Editor : ComponentBase
{
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
    }

    private void AddSlide()
    {
        slides.Add(
            new Slide { Id = Guid.NewGuid().ToString(), Name = $"Slide {slides.Count + 1}" }
        );
    }

    private void AddTextBlock() { }

    private void AddRectangle() { }

    private void AddCircle() { }

    private void TogglePresenterMode() { }

    private void ChangeUserRole(User user)
    {
        user.Role = user.Role == UserRole.Editor ? UserRole.Viewer : UserRole.Editor;
    }
}
