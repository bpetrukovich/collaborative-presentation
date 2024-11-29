using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CollaborativePresentation.Client.Pages;

public partial class Index : ComponentBase
{
    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    private string nickname = "";
    private string newPresentationName = ""; // Для имени новой презентации
    private List<Presentation> presentations = new List<Presentation>
    {
        new Presentation { Id = "1", Name = "Presentation 1" },
        new Presentation { Id = "2", Name = "Presentation 2" },
    };

    private bool modalOpened = false;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && !modalOpened)
        {
            await OpenModal("nicknameModal");
            modalOpened = true;
            StateHasChanged();
        }
    }

    private async Task SaveNickname()
    {
        if (!string.IsNullOrEmpty(nickname))
        {
            await CloseModal("nicknameModal");
        }
    }

    private async Task SaveNewPresentation()
    {
        if (!string.IsNullOrEmpty(newPresentationName))
        {
            presentations.Add(
                new Presentation { Id = Guid.NewGuid().ToString(), Name = newPresentationName }
            );
            newPresentationName = string.Empty;
            await CloseModal("createPresentationModal");
        }
    }

    private async Task OpenCreatePresentationModal()
    {
        await OpenModal("createPresentationModal");
    }

    private async Task JoinPresentation(string presentationId)
    {
        await JSRuntime.InvokeVoidAsync("alert", $"Joined Presentation {presentationId}");
    }

    private async Task OpenModal(string modalId)
    {
        await JSRuntime.InvokeVoidAsync("openModal", modalId);
    }

    private async Task CloseModal(string modalId)
    {
        await JSRuntime.InvokeVoidAsync("closeModal", modalId);
    }

    public class Presentation
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
