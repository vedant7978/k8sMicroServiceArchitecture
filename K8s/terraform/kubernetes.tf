resource "google_container_cluster" "primary"{
    name = "k8s-vedant-container"
    location = "us-central1-c"
    deletion_protection = false

    remove_default_node_pool = true
    initial_node_count       = 1
} 