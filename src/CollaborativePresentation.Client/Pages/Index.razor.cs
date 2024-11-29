using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace CollaborativePresentation.Client.Pages;

public partial class Index : ComponentBase
{
    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    private string nickname = "";
    private List<Presentation> presentations = new List<Presentation>
    {
        new Presentation { Id = "1", Name = "Presentation 1" },
        new Presentation { Id = "2", Name = "Presentation 2" },
    };

    private bool modalOpened = false;

    // Метод для открытия модального окна сразу при загрузке страницы
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && !modalOpened)
        {
            // Открытие модального окна
            await OpenModal();
            modalOpened = true;
            StateHasChanged(); // Обновить состояние компонента
        }
    }

    // Сохранение никнейма и закрытие модального окна
    private async Task SaveNickname()
    {
        if (!string.IsNullOrEmpty(nickname))
        {
            // Логика для сохранения никнейма
            await CloseModal(); // Закрыть модальное окно
        }
    }

    private async Task CloseModal()
    {
        await JSRuntime.InvokeVoidAsync("closeModal");
    }

    private async Task OpenModal()
    {
        await JSRuntime.InvokeVoidAsync("openModal");
    }

    private async Task JoinPresentation(string presentationId)
    {
        await JSRuntime.InvokeVoidAsync("alert", $"Joined Presentation {presentationId}");
    }

    public class Presentation
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
