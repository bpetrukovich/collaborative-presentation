public class Slide
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<SlideElement> Elements { get; set; } = new();
}

public class User
{
    public string Name { get; set; }
    public UserRole Role { get; set; }
}

public enum UserRole
{
    Editor,
    Viewer,
}

public class Element
{
    public ElementType Type { get; set; }
    public double Top { get; set; }
    public double Left { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public string Text { get; set; } = string.Empty;
    public string BackgroundColor { get; set; } = "#FFFFFF";
    public string TextColor { get; set; } = "#000000";
}

public enum ElementType
{
    Text,
    Rectangle,
    Circle,
}

public class SlideElement
{
    public string Type { get; set; } = string.Empty; // "circle", "rectangle", "text"
    public int X { get; set; }
    public int Y { get; set; }
    public string? Text { get; set; } // Only for text elements
}
