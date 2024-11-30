public class Slide
{
    public string Id { get; set; }
    public string Name { get; set; }
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
