#include <GLFW/glfw3.h>
#include <iostream>
#include <webgpu/webgpu_cpp.h>

int main(int, char**) {
	wgpu::Instance wgpuInstance = wgpu::CreateInstance();
	if (!wgpuInstance) {
		std::cerr << "Could not initialize WebGPU instance!" << std::endl;
		return 1;
	}

	if (!glfwInit()) {
		std::cerr << "Could not initialize GLFW!" << std::endl;
		return 1;
	}

	GLFWwindow* window = glfwCreateWindow(640, 480, "WebGPU", NULL, NULL);
	if (!window) {
		std::cerr << "Could not open window!" << std::endl;
		glfwTerminate();
		return 1;
	}

	while (!glfwWindowShouldClose(window)) {
		glfwPollEvents();
	}

	glfwDestroyWindow(window);
	glfwTerminate();
	return 0;
}
