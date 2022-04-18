import "./Sidebar.css";
export default function Sidebar(){
    return(
    <div class="wrapper">
    <nav id="sidebar">
        <div class="sidebar-header">
            <h3>Menu</h3>
        </div>
        <ul class="list-unstyled components">
            <li class="active">
                <a href="/uploadForm">Upload</a>
            </li>
            <li>
                <a href="#">About</a>
            </li>
        </ul>
    </nav>
</div>
    )
}